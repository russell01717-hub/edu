#pragma once

#include "CoreMinimal.h"
#include "GameFramework/PlayerState.h"
#include "RacingPlayerState.generated.h"

UCLASS()
class RACINGGAME_API ARacingPlayerState : public APlayerState
{
	GENERATED_BODY()

public:
	ARacingPlayerState();

	virtual void GetLifetimeReplicatedProps(TArray<FLifetimeProperty>& OutLifetimeProps) const override;

	UPROPERTY(Replicated, BlueprintReadOnly, Category = "Race")
	int32 CurrentLap;

	UPROPERTY(Replicated, BlueprintReadOnly, Category = "Race")
	int32 LastCheckpointIndex;

	UPROPERTY(Replicated, BlueprintReadOnly, Category = "Race")
	int32 TotalCheckpoints;

	UPROPERTY(Replicated, BlueprintReadOnly, Category = "Race")
	float RaceTime;

	UPROPERTY(Replicated, BlueprintReadOnly, Category = "Race")
	bool bIsRacing;

	UPROPERTY(Replicated, BlueprintReadOnly, Category = "Race")
	bool bFinished;

	UPROPERTY(Replicated, BlueprintReadOnly, Category = "Race")
	int32 FinalPosition;

	UFUNCTION(BlueprintCallable, Category = "Race")
	void OnPassCheckpoint(int32 CheckpointIndex, int32 TotalCheckpointsInTrack);

	UFUNCTION(BlueprintCallable, Category = "Race")
	bool HasCompletedRace() const;

	UFUNCTION(BlueprintCallable, Category = "Race")
	void ResetRaceState();
};
