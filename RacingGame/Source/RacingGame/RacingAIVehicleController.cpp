#include "RacingAIVehicleController.h"
#include "RacingTrackSpline.h"
#include "RacingVehiclePawn.h"
#include "ChaosWheeledVehicleMovementComponent.h"
#include "Kismet/GameplayStatics.h"

ARacingAIVehicleController::ARacingAIVehicleController()
{
	PrimaryActorTick.bCanEverTick = true;
	PrimaryActorTick.bStartWithTickEnabled = true;

	LookAheadDistance = 500.0f;
	MaxSpeedKmh = 250.0f;
	CornerBrakeDistance = 800.0f;
	SteeringSensitivity = 1.5f;
	DifficultyMultiplier = 1.0f;
	CurrentSplineDistance = 0.0f;
	OffsetOnSpline = 0.0f;
}

void ARacingAIVehicleController::BeginPlay()
{
	Super::BeginPlay();

	if (!TrackSpline)
	{
		TArray<AActor*> FoundActors;
		UGameplayStatics::GetAllActorsOfClass(GetWorld(), ARacingTrackSpline::StaticClass(), FoundActors);
		if (FoundActors.Num() > 0)
		{
			TrackSpline = Cast<ARacingTrackSpline>(FoundActors[0]);
		}
	}
}

void ARacingAIVehicleController::OnPossess(APawn* InPawn)
{
	Super::OnPossess(InPawn);
	VehiclePawn = Cast<ARacingVehiclePawn>(InPawn);
}

void ARacingAIVehicleController::Tick(float DeltaTime)
{
	Super::Tick(DeltaTime);

	if (!VehiclePawn || !TrackSpline) return;

	Drive(DeltaTime);
}

void ARacingAIVehicleController::SetTrackSpline(ARacingTrackSpline* Track)
{
	TrackSpline = Track;
}

void ARacingAIVehicleController::SetDifficulty(float SkillLevel)
{
	DifficultyMultiplier = SkillLevel;
	MaxSpeedKmh *= SkillLevel;
}

void ARacingAIVehicleController::Drive(float DeltaTime)
{
	FVector VehicleLocation = VehiclePawn->GetActorLocation();

	float ClosestDistance = TrackSpline->GetDistanceAlongSpline(VehicleLocation);
	float TrackLength = TrackSpline->GetTrackLength();

	float LookAhead = LookAheadDistance * DifficultyMultiplier;
	float TargetDistance = ClosestDistance + LookAhead;

	if (TargetDistance >= TrackLength)
	{
		TargetDistance -= TrackLength;
	}

	FVector TargetLocation = TrackSpline->GetSplineLocationAtDistance(TargetDistance);

	float Steering = CalculateSteering(TargetLocation);
	float SpeedFactor = CalculateSpeedFactor(TargetLocation);

	float EffectiveMaxSpeed = MaxSpeedKmh * SpeedFactor;
	float CurrentSpeed = VehiclePawn->GetForwardSpeedKmh();

	float Throttle = 0.0f;
	float Brake = 0.0f;

	if (CurrentSpeed < EffectiveMaxSpeed * 0.95f)
	{
		Throttle = 1.0f;
		Brake = 0.0f;
	}
	else if (CurrentSpeed > EffectiveMaxSpeed * 1.05f)
	{
		Throttle = 0.0f;
		Brake = 0.5f;
	}
	else
	{
		Throttle = 0.3f;
		Brake = 0.0f;
	}

	VehiclePawn->ApplySteer(Steering);
	VehiclePawn->ApplyThrottle(Throttle);
	VehiclePawn->ApplyBrake(Brake);
}

float ARacingAIVehicleController::CalculateSteering(const FVector& TargetLocation)
{
	FVector VehicleLocation = VehiclePawn->GetActorLocation();
	FVector VehicleForward = VehiclePawn->GetActorForwardVector();
	FVector ToTarget = TargetLocation - VehicleLocation;
	ToTarget.Z = 0.0f;
	ToTarget.Normalize();

	float CrossProduct = FVector::CrossProduct(VehicleForward, ToTarget).Z;

	return FMath::Clamp(CrossProduct * SteeringSensitivity, -1.0f, 1.0f);
}

float ARacingAIVehicleController::CalculateSpeedFactor(const FVector& TargetLocation)
{
	FVector VehicleLocation = VehiclePawn->GetActorLocation();
	FVector VehicleForward = VehiclePawn->GetActorForwardVector();

	float LookAheadForCorner = CornerBrakeDistance * DifficultyMultiplier;
	float CornerCheckDist = TrackSpline->GetDistanceAlongSpline(VehicleLocation) + LookAheadForCorner;

	if (CornerCheckDist >= TrackSpline->GetTrackLength())
	{
		CornerCheckDist -= TrackSpline->GetTrackLength();
	}

	FVector CornerCheckLocation = TrackSpline->GetSplineLocationAtDistance(CornerCheckDist);
	FVector CornerDirection = TrackSpline->GetSplineDirectionAtDistance(CornerCheckDist);

	FVector VehicleDir = VehicleForward;
	VehicleDir.Z = 0.0f;
	VehicleDir.Normalize();

	FVector TrackDir = CornerDirection;
	TrackDir.Z = 0.0f;
	TrackDir.Normalize();

	float DotProduct = FVector::DotProduct(VehicleDir, TrackDir);
	float AlignmentFactor = FMath::Clamp((DotProduct + 1.0f) * 0.5f, 0.0f, 1.0f);

	return FMath::Clamp(AlignmentFactor * 0.8f + 0.2f, 0.0f, 1.0f);
}
