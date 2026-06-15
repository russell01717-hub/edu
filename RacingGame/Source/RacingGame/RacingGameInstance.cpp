#include "RacingGameInstance.h"
#include "Kismet/GameplayStatics.h"

void URacingGameInstance::Init()
{
	Super::Init();
	LoadSettings();
}

void URacingGameInstance::LoadSettings()
{
	MasterVolume = 1.0f;
	SFXVolume = 1.0f;
	MusicVolume = 0.8f;
	bInvertCameraY = false;
	CameraSensitivity = 1.0f;
	SelectedCarIndex = 0;
	SelectedTrackIndex = 0;
}

void URacingGameInstance::SaveSettings()
{
}
