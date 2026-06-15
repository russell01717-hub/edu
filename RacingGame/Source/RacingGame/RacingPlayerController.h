#pragma once

#include "CoreMinimal.h"
#include "GameFramework/PlayerController.h"
#include "RacingPlayerController.generated.h"

UCLASS()
class RACINGGAME_API ARacingPlayerController : public APlayerController
{
	GENERATED_BODY()

public:
	ARacingPlayerController();

	virtual void BeginPlay() override;
	virtual void Tick(float DeltaTime) override;
	virtual void SetupInputComponent() override;

	void OnPause();

	UFUNCTION(Client, Reliable)
	void ClientShowCountdown(int32 TimeLeft);

	UFUNCTION(Client, Reliable)
	void ClientShowRaceResult(int32 FinalPosition, float RaceTime);

	UFUNCTION(Client, Reliable)
	void ClientUpdateHUD(float Speed, int32 Lap, int32 TotalLaps, int32 Position, int32 TotalCars);

	UFUNCTION(BlueprintImplementableEvent)
	void ShowCountdownOnHUD(int32 TimeLeft);

	UFUNCTION(BlueprintImplementableEvent)
	void ShowRaceResultOnHUD(int32 FinalPosition, float RaceTime);

	UFUNCTION(BlueprintImplementableEvent)
	void UpdateHUD(float Speed, int32 Lap, int32 TotalLaps, int32 Position, int32 TotalCars);

protected:
	UPROPERTY(EditDefaultsOnly, BlueprintReadOnly, Category = "UI")
	TSubclassOf<UUserWidget> HUDWidgetClass;

	UPROPERTY(EditDefaultsOnly, BlueprintReadOnly, Category = "UI")
	TSubclassOf<UUserWidget> PauseMenuClass;

	UPROPERTY()
	UUserWidget* HUDWidget;

	UPROPERTY()
	UUserWidget* PauseMenuWidget;
};
