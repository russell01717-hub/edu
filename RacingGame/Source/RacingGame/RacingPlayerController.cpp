#include "RacingPlayerController.h"
#include "Blueprint/UserWidget.h"
#include "RacingVehiclePawn.h"

ARacingPlayerController::ARacingPlayerController()
{
	bShowMouseCursor = false;
	bEnableClickEvents = false;
	bEnableMouseOverEvents = false;
}

void ARacingPlayerController::BeginPlay()
{
	Super::BeginPlay();

	if (IsLocalPlayerController())
	{
		if (HUDWidgetClass)
		{
			HUDWidget = CreateWidget<UUserWidget>(this, HUDWidgetClass);
			if (HUDWidget)
			{
				HUDWidget->AddToViewport();
			}
		}
	}
}

void ARacingPlayerController::Tick(float DeltaTime)
{
	Super::Tick(DeltaTime);

	ARacingVehiclePawn* Vehicle = Cast<ARacingVehiclePawn>(GetPawn());
	if (Vehicle && IsLocalPlayerController())
	{
		ClientUpdateHUD(
			Vehicle->GetForwardSpeedKmh(),
			0, 3, 0, 4
		);
	}
}

void ARacingPlayerController::SetupInputComponent()
{
	Super::SetupInputComponent();
	InputComponent->BindAction("Pause", IE_Pressed, this, &ARacingPlayerController::OnPause);
}

void ARacingPlayerController::OnPause()
{
	if (PauseMenuWidget && PauseMenuWidget->IsInViewport())
	{
		PauseMenuWidget->RemoveFromParent();
		PauseMenuWidget = nullptr;
		SetPause(false);
		SetShowMouseCursor(false);
		FInputModeGameOnly InputMode;
		SetInputMode(InputMode);
	}
	else
	{
		if (PauseMenuClass)
		{
			PauseMenuWidget = CreateWidget<UUserWidget>(this, PauseMenuClass);
			if (PauseMenuWidget)
			{
				PauseMenuWidget->AddToViewport();
			}
		}
		SetPause(true);
		SetShowMouseCursor(true);
		FInputModeUIOnly InputMode;
		SetInputMode(InputMode);
	}
}

void ARacingPlayerController::ClientShowCountdown_Implementation(int32 TimeLeft)
{
	ShowCountdownOnHUD(TimeLeft);
}

void ARacingPlayerController::ClientShowRaceResult_Implementation(int32 FinalPosition, float RaceTime)
{
	ShowRaceResultOnHUD(FinalPosition, RaceTime);
}

void ARacingPlayerController::ClientUpdateHUD_Implementation(float Speed, int32 Lap, int32 TotalLaps, int32 Position, int32 TotalCars)
{
	UpdateHUD(Speed, Lap, TotalLaps, Position, TotalCars);
}
