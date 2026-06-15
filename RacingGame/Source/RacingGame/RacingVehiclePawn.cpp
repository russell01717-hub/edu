#include "RacingVehiclePawn.h"
#include "ChaosWheeledVehicleMovementComponent.h"
#include "Components/AudioComponent.h"
#include "Camera/CameraComponent.h"
#include "GameFramework/SpringArmComponent.h"
#include "Kismet/GameplayStatics.h"

ARacingVehiclePawn::ARacingVehiclePawn()
{
	PrimaryActorTick.bCanEverTick = true;

	ChaosVehicleMovement = Cast<UChaosWheeledVehicleMovementComponent>(GetVehicleMovement());
	if (!ChaosVehicleMovement)
	{
		ChaosVehicleMovement = CreateDefaultSubobject<UChaosWheeledVehicleMovementComponent>(TEXT("ChaosVehicleMovement"));
		SetVehicleMovementComponent(ChaosVehicleMovement);
	}

	SpringArm = CreateDefaultSubobject<USpringArmComponent>(TEXT("SpringArm"));
	SpringArm->SetupAttachment(GetMesh());
	SpringArm->TargetArmLength = 600.0f;
	SpringArm->SocketOffset = FVector(0.0f, 0.0f, 100.0f);
	SpringArm->bEnableCameraLag = true;
	SpringArm->CameraLagSpeed = 5.0f;
	SpringArm->bEnableCameraRotationLag = true;
	SpringArm->CameraRotationLagSpeed = 8.0f;
	SpringArm->bDoCollisionTest = true;

	Camera = CreateDefaultSubobject<UCameraComponent>(TEXT("Camera"));
	Camera->SetupAttachment(SpringArm, USpringArmComponent::SocketName);
	Camera->FieldOfView = 90.0f;

	CameraOffsets.Add(FVector(0.0f, 0.0f, 100.0f));
	CameraOffsets.Add(FVector(-300.0f, 0.0f, 50.0f));
	CameraOffsets.Add(FVector(0.0f, 0.0f, 30.0f));

	EngineAudio = CreateDefaultSubobject<UAudioComponent>(TEXT("EngineAudio"));
	EngineAudio->SetupAttachment(GetMesh());

	CurrentCameraView = 0;
	CurrentThrottle = 0.0f;
	CurrentSteer = 0.0f;
	CurrentBrake = 0.0f;
	EnginePitch = 0.5f;
}

void ARacingVehiclePawn::BeginPlay()
{
	Super::BeginPlay();
	CurrentCameraView = 0;
	UpdateCameraView();
}

void ARacingVehiclePawn::Tick(float DeltaTime)
{
	Super::Tick(DeltaTime);
	UpdateEngineSound(DeltaTime);
}

void ARacingVehiclePawn::SetupPlayerInputComponent(UInputComponent* PlayerInputComponent)
{
	Super::SetupPlayerInputComponent(PlayerInputComponent);

	PlayerInputComponent->BindAxis("Throttle", this, &ARacingVehiclePawn::ApplyThrottle);
	PlayerInputComponent->BindAxis("BrakeAxis", this, &ARacingVehiclePawn::ApplyBrake);
	PlayerInputComponent->BindAxis("Steer", this, &ARacingVehiclePawn::ApplySteer);

	PlayerInputComponent->BindAction("Handbrake", IE_Pressed, this, &ARacingVehiclePawn::ApplyHandbrake);
	PlayerInputComponent->BindAction("Handbrake", IE_Released, this, &ARacingVehiclePawn::ReleaseHandbrake);
	PlayerInputComponent->BindAction("ResetVehicle", IE_Pressed, this, &ARacingVehiclePawn::ResetVehicle);
	PlayerInputComponent->BindAction("ToggleCamera", IE_Pressed, this, &ARacingVehiclePawn::ToggleCamera);
}

void ARacingVehiclePawn::ApplyThrottle(float Value)
{
	CurrentThrottle = FMath::Clamp(Value, 0.0f, 1.0f);
	if (ChaosVehicleMovement)
	{
		ChaosVehicleMovement->SetThrottleInput(CurrentThrottle);
	}
}

void ARacingVehiclePawn::ApplyBrake(float Value)
{
	CurrentBrake = FMath::Clamp(Value, 0.0f, 1.0f);
	if (ChaosVehicleMovement)
	{
		ChaosVehicleMovement->SetBrakeInput(CurrentBrake);
	}
}

void ARacingVehiclePawn::ApplySteer(float Value)
{
	CurrentSteer = FMath::Clamp(Value, -1.0f, 1.0f);
	if (ChaosVehicleMovement)
	{
		ChaosVehicleMovement->SetSteeringInput(CurrentSteer);
	}
}

void ARacingVehiclePawn::ApplyHandbrake()
{
	if (ChaosVehicleMovement)
	{
		ChaosVehicleMovement->SetHandbrakeInput(true);
	}
}

void ARacingVehiclePawn::ReleaseHandbrake()
{
	if (ChaosVehicleMovement)
	{
		ChaosVehicleMovement->SetHandbrakeInput(false);
	}
}

void ARacingVehiclePawn::ResetVehicle()
{
	SetActorLocation(FVector(0.0f, 0.0f, 200.0f));
	SetActorRotation(FRotator(0.0f, 0.0f, 0.0f));
	ChaosVehicleMovement->ResetVehicle();
}

void ARacingVehiclePawn::ToggleCamera()
{
	CurrentCameraView = (CurrentCameraView + 1) % CameraOffsets.Num();
	UpdateCameraView();
}

void ARacingVehiclePawn::UpdateCameraView()
{
	if (CameraOffsets.IsValidIndex(CurrentCameraView))
	{
		SpringArm->SocketOffset = CameraOffsets[CurrentCameraView];

		switch (CurrentCameraView)
		{
		case 0:
			SpringArm->TargetArmLength = 600.0f;
			SpringArm->bEnableCameraRotationLag = true;
			break;
		case 1:
			SpringArm->TargetArmLength = 300.0f;
			SpringArm->bEnableCameraRotationLag = false;
			break;
		case 2:
			SpringArm->TargetArmLength = 0.0f;
			SpringArm->bEnableCameraRotationLag = false;
			break;
		}
	}
}

float ARacingVehiclePawn::GetForwardSpeedKmh() const
{
	if (ChaosVehicleMovement)
	{
		return ChaosVehicleMovement->GetForwardSpeed() * 0.036f;
	}
	return 0.0f;
}

float ARacingVehiclePawn::GetSteeringAngle() const
{
	if (ChaosVehicleMovement)
	{
		return ChaosVehicleMovement->GetSteeringInput() * 45.0f;
	}
	return 0.0f;
}

float ARacingVehiclePawn::GetThrottlePercent() const
{
	return CurrentThrottle;
}

int32 ARacingVehiclePawn::GetCurrentGear() const
{
	if (ChaosVehicleMovement)
	{
		return ChaosVehicleMovement->GetCurrentGear();
	}
	return 0;
}

void ARacingVehiclePawn::UpdateEngineSound(float DeltaTime)
{
	float Speed = GetForwardSpeedKmh();
	float TargetPitch = FMath::GetMappedRangeValueClamped(FVector2D(0.0f, 300.0f), FVector2D(0.4f, 2.0f), Speed);
	EnginePitch = FMath::FInterpTo(EnginePitch, TargetPitch, DeltaTime, 3.0f);

	if (EngineAudio && EngineAudio->Sound)
	{
		EngineAudio->SetPitchMultiplier(EnginePitch);

		float TargetVolume = CurrentThrottle > 0.1f ? 1.0f : 0.3f;
		float NewVolume = FMath::FInterpTo(EngineAudio->VolumeMultiplier, TargetVolume, DeltaTime, 2.0f);
		EngineAudio->SetVolumeMultiplier(NewVolume);
	}
}
