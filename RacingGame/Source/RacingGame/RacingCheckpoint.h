#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "RacingCheckpoint.generated.h"

class UBoxComponent;
class ARacingVehiclePawn;

DECLARE_DYNAMIC_MULTICAST_DELEGATE_TwoParams(FOnCheckpointPassed, ARacingCheckpoint*, Checkpoint, ARacingVehiclePawn*, Vehicle);

UCLASS()
class RACINGGAME_API ARacingCheckpoint : public AActor
{
	GENERATED_BODY()

public:
	ARacingCheckpoint();

	UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Checkpoint")
	UBoxComponent* TriggerBox;

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Checkpoint")
	int32 CheckpointIndex;

	UPROPERTY(BlueprintAssignable, Category = "Checkpoint")
	FOnCheckpointPassed OnCheckpointPassed;

	UFUNCTION()
	void OnOverlapBegin(UPrimitiveComponent* OverlappedComponent, AActor* OtherActor,
		UPrimitiveComponent* OtherComp, int32 OtherBodyIndex,
		bool bFromSweep, const FHitResult& SweepResult);

protected:
	virtual void BeginPlay() override;
};
