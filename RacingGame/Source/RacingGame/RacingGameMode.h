#pragma once

#include "CoreMinimal.h"
#include "GameFramework/GameModeBase.h"
#include "RacingGameState.h"
#include "RacingGameMode.generated.h"

class ARacingTrackSpline;
class ARacingCheckpoint;
class ARacingVehiclePawn;

UCLASS()
class RACINGGAME_API ARacingGameMode : public AGameModeBase
{
	GENERATED_BODY()

public:
	ARacingGameMode();

	virtual void BeginPlay() override;
	virtual void Tick(float DeltaTime) override;
	virtual void PostLogin(APlayerController* NewPlayer) override;

	UFUNCTION(BlueprintCallable, Category = "Race")
	void OnVehiclePassCheckpoint(ARacingCheckpoint* Checkpoint, ARacingVehiclePawn* Vehicle);

	UFUNCTION(BlueprintCallable, Category = "Race")
	void StartRace();

	UFUNCTION(BlueprintCallable, Category = "Race")
	void EndRace();

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Race")
	int32 NumberOfAI;

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Race")
	TSubclassOf<ARacingVehiclePawn> AIVehicleClass;

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Race")
	TSubclassOf<AController> AIControllerClass;

	UPROPERTY(BlueprintReadOnly, Category = "Race")
	ARacingTrackSpline* TrackSpline;

protected:
	void FindTrack();
	void SpawnAIVehicles();
	void SetupCheckpoints();
	void AssignFinalPositions();

	TArray<TObjectPtr<ARacingCheckpoint>> Checkpoints;
	TArray<TObjectPtr<ARacingVehiclePawn>> AIVehicles;
};
