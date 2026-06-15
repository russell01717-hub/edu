#pragma once

#include "CoreMinimal.h"
#include "WheeledVehiclePawn.h"
#include "RacingVehiclePawn.generated.h"

class UChaosWheeledVehicleMovementComponent;
class USpringArmComponent;
class UCameraComponent;
class UAudioComponent;

UCLASS()
class RACINGGAME_API ARacingVehiclePawn : public AWheeledVehiclePawn
{
	GENERATED_BODY()

public:
	ARacingVehiclePawn();

	virtual void Tick(float DeltaTime) override;
	virtual void SetupPlayerInputComponent(class UInputComponent* PlayerInputComponent) override;

	void ApplyThrottle(float Value);
	void ApplyBrake(float Value);
	void ApplySteer(float Value);
	void ApplyHandbrake();
	void ReleaseHandbrake();
	void ResetVehicle();
	void ToggleCamera();

	float GetForwardSpeedKmh() const;
	float GetSteeringAngle() const;
	float GetThrottlePercent() const;
	int32 GetCurrentGear() const;

	UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Camera")
	USpringArmComponent* SpringArm;

	UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Camera")
	UCameraComponent* Camera;

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Camera")
	TArray<FVector> CameraOffsets;

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Audio")
	UAudioComponent* EngineAudio;

	UPROPERTY(EditDefaultsOnly, BlueprintReadOnly, Category = "Vehicle")
	UChaosWheeledVehicleMovementComponent* ChaosVehicleMovement;

protected:
	virtual void BeginPlay() override;

private:
	int32 CurrentCameraView;
	float CurrentThrottle;
	float CurrentSteer;
	float CurrentBrake;
	float EnginePitch;

	void UpdateEngineSound(float DeltaTime);
	void UpdateCameraView();
};
