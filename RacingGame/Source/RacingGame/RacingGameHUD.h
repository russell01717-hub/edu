#pragma once

#include "CoreMinimal.h"
#include "GameFramework/HUD.h"
#include "RacingGameHUD.generated.h"

UCLASS()
class RACINGGAME_API ARacingGameHUD : public AHUD
{
	GENERATED_BODY()

public:
	ARacingGameHUD();

	virtual void DrawHUD() override;
	virtual void BeginPlay() override;

	UPROPERTY(EditDefaultsOnly, BlueprintReadOnly, Category = "UI")
	TSubclassOf<UUserWidget> HUDWidgetClass;

protected:
	UPROPERTY()
	UUserWidget* HUDWidget;
};
