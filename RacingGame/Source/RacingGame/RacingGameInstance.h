#pragma once

#include "CoreMinimal.h"
#include "Engine/GameInstance.h"
#include "RacingGameInstance.generated.h"

UCLASS()
class RACINGGAME_API URacingGameInstance : public UGameInstance
{
	GENERATED_BODY()

public:
	UPROPERTY(BlueprintReadWrite, Category = "Settings")
	float MasterVolume;

	UPROPERTY(BlueprintReadWrite, Category = "Settings")
	float SFXVolume;

	UPROPERTY(BlueprintReadWrite, Category = "Settings")
	float MusicVolume;

	UPROPERTY(BlueprintReadWrite, Category = "Settings")
	bool bInvertCameraY;

	UPROPERTY(BlueprintReadWrite, Category = "Settings")
	float CameraSensitivity;

	UPROPERTY(BlueprintReadWrite, Category = "Settings")
	int32 SelectedCarIndex;

	UPROPERTY(BlueprintReadWrite, Category = "Settings")
	int32 SelectedTrackIndex;

	virtual void Init() override;

	UFUNCTION(BlueprintCallable, Category = "Settings")
	void LoadSettings();

	UFUNCTION(BlueprintCallable, Category = "Settings")
	void SaveSettings();
};
