#include "RacingGameHUD.h"
#include "Blueprint/UserWidget.h"

ARacingGameHUD::ARacingGameHUD()
{
}

void ARacingGameHUD::BeginPlay()
{
	Super::BeginPlay();

	if (HUDWidgetClass)
	{
		HUDWidget = CreateWidget<UUserWidget>(GetOwningPlayerController(), HUDWidgetClass);
		if (HUDWidget)
		{
			HUDWidget->AddToViewport();
		}
	}
}

void ARacingGameHUD::DrawHUD()
{
	Super::DrawHUD();
}
