#include "RacingGameState.h"
#include "RacingPlayerState.h"
#include "RacingGameMode.h"
#include "Net/UnrealNetwork.h"

ARacingGameState::ARacingGameState()
{
	PrimaryActorTick.bCanEverTick = true;
	PrimaryActorTick.bStartWithTickEnabled = true;

	RaceState = ERaceState::WaitingToStart;
	TotalLaps = 3;
	CountdownDuration = 3.0f;
	CountdownTime = 0.0f;
}

void ARacingGameState::GetLifetimeReplicatedProps(TArray<FLifetimeProperty>& OutLifetimeProps) const
{
	Super::GetLifetimeReplicatedProps(OutLifetimeProps);
	DOREPLIFETIME(ARacingGameState, RaceState);
	DOREPLIFETIME(ARacingGameState, RaceStartTime);
	DOREPLIFETIME(ARacingGameState, TotalLaps);
}

void ARacingGameState::Tick(float DeltaTime)
{
	Super::Tick(DeltaTime);

	if (RaceState == ERaceState::Countdown)
	{
		CountdownTime += DeltaTime;
		if (CountdownTime >= CountdownDuration)
		{
			StartRace();
		}
	}
}

void ARacingGameState::SetRaceState(ERaceState NewState)
{
	RaceState = NewState;
}

void ARacingGameState::StartCountdown()
{
	RaceState = ERaceState::Countdown;
	CountdownTime = 0.0f;
}

void ARacingGameState::StartRace()
{
	RaceState = ERaceState::Racing;
	RaceStartTime = GetWorld()->GetTimeSeconds();
}

void ARacingGameState::EndRace()
{
	RaceState = ERaceState::Finished;
}

TArray<ARacingPlayerState*> ARacingGameState::GetSortedPositions() const
{
	TArray<ARacingPlayerState*> SortedPlayers;

	for (APlayerState* PS : PlayerArray)
	{
		if (ARacingPlayerState* RPS = Cast<ARacingPlayerState>(PS))
		{
			SortedPlayers.Add(RPS);
		}
	}

	SortedPlayers.Sort([](ARacingPlayerState& A, ARacingPlayerState& B)
	{
		if (A.CurrentLap != B.CurrentLap)
			return A.CurrentLap > B.CurrentLap;

		return A.LastCheckpointIndex > B.LastCheckpointIndex;
	});

	return SortedPlayers;
}
