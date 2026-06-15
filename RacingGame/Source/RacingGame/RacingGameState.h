#pragma once

#include "CoreMinimal.h"
#include "GameFramework/GameStateBase.h"
#include "RacingGameState.generated.h"

UENUM(BlueprintType)
enum class ERaceState : uint8
{
	WaitingToStart,
	Countdown,
	Racing,
	Finished,
};

UCLASS()
class RACINGGAME_API ARacingGameState : public AGameStateBase
{
	GENERATED_BODY()

public:
	ARacingGameState();

	virtual void GetLifetimeReplicatedProps(TArray<FLifetimeProperty>& OutLifetimeProps) const override;
	virtual void Tick(float DeltaTime) override;

	UPROPERTY(Replicated, BlueprintReadOnly, Category = "Race")
	ERaceState RaceState;

	UPROPERTY(Replicated, BlueprintReadOnly, Category = "Race")
	float RaceStartTime;

	UPROPERTY(Replicated, BlueprintReadOnly, Category = "Race")
	int32 TotalLaps;

	TArray<class ARacingPlayerState*> GetSortedPositions() const;

	UFUNCTION(BlueprintCallable, Category = "Race")
	void SetRaceState(ERaceState NewState);

	UFUNCTION(BlueprintCallable, Category = "Race")
	void StartCountdown();

	UFUNCTION(BlueprintCallable, Category = "Race")
	void StartRace();

	UFUNCTION(BlueprintCallable, Category = "Race")
	void EndRace();

protected:
	float CountdownTime;
	float CountdownDuration;
};
