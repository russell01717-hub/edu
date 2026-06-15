#pragma once

#include "CoreMinimal.h"
#include "AIController.h"
#include "RacingAIVehicleController.generated.h"

class ARacingTrackSpline;
class ARacingVehiclePawn;

UCLASS()
class RACINGGAME_API ARacingAIVehicleController : public AAIController
{
	GENERATED_BODY()

public:
	ARacingAIVehicleController();

	virtual void Tick(float DeltaTime) override;
	virtual void OnPossess(APawn* InPawn) override;
	virtual void BeginPlay() override;

	UFUNCTION(BlueprintCallable, Category = "AI")
	void SetTrackSpline(ARacingTrackSpline* Track);

	UFUNCTION(BlueprintCallable, Category = "AI")
	void SetDifficulty(float SkillLevel);

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "AI")
	float LookAheadDistance;

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "AI")
	float MaxSpeedKmh;

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "AI")
	float CornerBrakeDistance;

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "AI")
	float SteeringSensitivity;

protected:
	void Drive(float DeltaTime);
	float CalculateSteering(const FVector& TargetLocation);
	float CalculateSpeedFactor(const FVector& TargetLocation);

	UPROPERTY()
	ARacingTrackSpline* TrackSpline;

	UPROPERTY()
	ARacingVehiclePawn* VehiclePawn;

	float DifficultyMultiplier;
	float CurrentSplineDistance;
	float OffsetOnSpline;
};
