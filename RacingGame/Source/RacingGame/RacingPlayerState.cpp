#include "RacingPlayerState.h"
#include "RacingGameState.h"
#include "Net/UnrealNetwork.h"
#include "Engine/World.h"

ARacingPlayerState::ARacingPlayerState()
{
	CurrentLap = 1;
	LastCheckpointIndex = -1;
	TotalCheckpoints = 0;
	RaceTime = 0.0f;
	bIsRacing = false;
	bFinished = false;
	FinalPosition = -1;
}

void ARacingPlayerState::GetLifetimeReplicatedProps(TArray<FLifetimeProperty>& OutLifetimeProps) const
{
	Super::GetLifetimeReplicatedProps(OutLifetimeProps);
	DOREPLIFETIME(ARacingPlayerState, CurrentLap);
	DOREPLIFETIME(ARacingPlayerState, LastCheckpointIndex);
	DOREPLIFETIME(ARacingPlayerState, TotalCheckpoints);
	DOREPLIFETIME(ARacingPlayerState, RaceTime);
	DOREPLIFETIME(ARacingPlayerState, bIsRacing);
	DOREPLIFETIME(ARacingPlayerState, bFinished);
	DOREPLIFETIME(ARacingPlayerState, FinalPosition);
}

void ARacingPlayerState::OnPassCheckpoint(int32 CheckpointIndex, int32 TotalCheckpointsInTrack)
{
	TotalCheckpoints = TotalCheckpointsInTrack;

	int32 ExpectedNextIndex = (LastCheckpointIndex + 1) % TotalCheckpoints;
	int32 StartLineIndex = 0;

	if (!bIsRacing)
	{
		if (CheckpointIndex == StartLineIndex)
		{
			bIsRacing = true;
			LastCheckpointIndex = CheckpointIndex;
		}
		return;
	}

	if (CheckpointIndex == ExpectedNextIndex)
	{
		LastCheckpointIndex = CheckpointIndex;

		if (CheckpointIndex == StartLineIndex)
		{
			CurrentLap++;

			ARacingGameState* GS = GetWorld()->GetGameState<ARacingGameState>();
			if (GS && CurrentLap > GS->TotalLaps)
			{
				bFinished = true;
				RaceTime = GetWorld()->GetTimeSeconds() - GS->RaceStartTime;
			}
		}
	}
}

bool ARacingPlayerState::HasCompletedRace() const
{
	return bFinished;
}

void ARacingPlayerState::ResetRaceState()
{
	CurrentLap = 1;
	LastCheckpointIndex = -1;
	RaceTime = 0.0f;
	bIsRacing = false;
	bFinished = false;
	FinalPosition = -1;
}
