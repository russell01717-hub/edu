#include "RacingGameMode.h"
#include "RacingTrackSpline.h"
#include "RacingCheckpoint.h"
#include "RacingVehiclePawn.h"
#include "RacingPlayerState.h"
#include "RacingGameState.h"
#include "RacingAIVehicleController.h"
#include "Kismet/GameplayStatics.h"
#include "Engine/World.h"
#include "GameFramework/PlayerStart.h"

ARacingGameMode::ARacingGameMode()
{
	PrimaryActorTick.bCanEverTick = true;
	PrimaryActorTick.bStartWithTickEnabled = true;

	GameStateClass = ARacingGameState::StaticClass();
	PlayerStateClass = ARacingPlayerState::StaticClass();
	DefaultPawnClass = ARacingVehiclePawn::StaticClass();

	NumberOfAI = 3;
}

void ARacingGameMode::BeginPlay()
{
	Super::BeginPlay();
	FindTrack();
	SetupCheckpoints();
	SpawnAIVehicles();
	StartRace();
}

void ARacingGameMode::Tick(float DeltaTime)
{
	Super::Tick(DeltaTime);
}

void ARacingGameMode::PostLogin(APlayerController* NewPlayer)
{
	Super::PostLogin(NewPlayer);
}

void ARacingGameMode::FindTrack()
{
	TArray<AActor*> FoundActors;
	UGameplayStatics::GetAllActorsOfClass(GetWorld(), ARacingTrackSpline::StaticClass(), FoundActors);
	if (FoundActors.Num() > 0)
	{
		TrackSpline = Cast<ARacingTrackSpline>(FoundActors[0]);
	}
}

void ARacingGameMode::SpawnAIVehicles()
{
	if (!AIVehicleClass || !AIControllerClass || !TrackSpline) return;

	FActorSpawnParameters SpawnParams;
	SpawnParams.SpawnCollisionHandlingOverride = ESpawnActorCollisionHandlingMethod::AdjustIfPossibleButAlwaysSpawn;

	TArray<AActor*> PlayerStarts;
	UGameplayStatics::GetAllActorsOfClass(GetWorld(), APlayerStart::StaticClass(), PlayerStarts);

	for (int32 i = 0; i < NumberOfAI; i++)
	{
		FVector SpawnLocation = FVector(0.0f, (i + 1) * 400.0f, 100.0f);
		FRotator SpawnRotation = FRotator::ZeroRotator;

		if (PlayerStarts.IsValidIndex(i + 1))
		{
			SpawnLocation = PlayerStarts[i + 1]->GetActorLocation();
			SpawnRotation = PlayerStarts[i + 1]->GetActorRotation();
		}

		ARacingVehiclePawn* AIVehicle = GetWorld()->SpawnActor<ARacingVehiclePawn>(AIVehicleClass, SpawnLocation, SpawnRotation, SpawnParams);
		if (AIVehicle)
		{
			ARacingAIVehicleController* AIController = GetWorld()->SpawnActor<ARacingAIVehicleController>(AIControllerClass, SpawnLocation, SpawnRotation, SpawnParams);
			if (AIController)
			{
				AIController->Possess(AIVehicle);
				AIController->SetTrackSpline(TrackSpline);
				AIController->SetDifficulty(FMath::RandRange(0.7f, 1.2f));
			}
			AIVehicles.Add(AIVehicle);
		}
	}
}

void ARacingGameMode::SetupCheckpoints()
{
	if (!TrackSpline) return;

	Checkpoints = TrackSpline->Checkpoints;

	for (int32 i = 0; i < Checkpoints.Num(); i++)
	{
		if (Checkpoints[i])
		{
			Checkpoints[i]->CheckpointIndex = i;
			Checkpoints[i]->OnCheckpointPassed.AddDynamic(this, &ARacingGameMode::OnVehiclePassCheckpoint);
		}
	}
}

void ARacingGameMode::StartRace()
{
	ARacingGameState* GS = GetGameState<ARacingGameState>();
	if (GS)
	{
		GS->TotalLaps = TrackSpline ? TrackSpline->NumLaps : 3;
		GS->StartCountdown();
	}
}

void ARacingGameMode::EndRace()
{
	ARacingGameState* GS = GetGameState<ARacingGameState>();
	if (GS)
	{
		GS->EndRace();
		AssignFinalPositions();
	}

	for (ARacingVehiclePawn* Vehicle : AIVehicles)
	{
		if (Vehicle)
		{
			Vehicle->ApplyThrottle(0.0f);
			Vehicle->ApplyBrake(1.0f);
		}
	}
}

void ARacingGameMode::OnVehiclePassCheckpoint(ARacingCheckpoint* Checkpoint, ARacingVehiclePawn* Vehicle)
{
	if (!Checkpoint || !Vehicle) return;

	ARacingPlayerState* PS = Vehicle->GetPlayerState<ARacingPlayerState>();
	if (!PS) return;

	int32 TotalCheckpoints = Checkpoints.Num();
	PS->OnPassCheckpoint(Checkpoint->CheckpointIndex, TotalCheckpoints);

	if (PS->HasCompletedRace())
	{
		EndRace();
	}
}

void ARacingGameMode::AssignFinalPositions()
{
	ARacingGameState* GS = GetGameState<ARacingGameState>();
	if (!GS) return;

	TArray<ARacingPlayerState*> Sorted = GS->GetSortedPositions();
	for (int32 i = 0; i < Sorted.Num(); i++)
	{
		if (Sorted[i])
		{
			Sorted[i]->FinalPosition = i + 1;
		}
	}
}
