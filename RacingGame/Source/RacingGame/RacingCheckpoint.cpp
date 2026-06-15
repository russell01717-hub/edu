#include "RacingCheckpoint.h"
#include "Components/BoxComponent.h"
#include "RacingVehiclePawn.h"
#include "RacingPlayerState.h"

ARacingCheckpoint::ARacingCheckpoint()
{
	PrimaryActorTick.bCanEverTick = false;

	TriggerBox = CreateDefaultSubobject<UBoxComponent>(TEXT("TriggerBox"));
	RootComponent = TriggerBox;
	TriggerBox->SetBoxExtent(FVector(100.0f, 800.0f, 300.0f));
	TriggerBox->SetCollisionEnabled(ECollisionEnabled::QueryOnly);
	TriggerBox->SetCollisionResponseToAllChannels(ECR_Ignore);
	TriggerBox->SetCollisionResponseToChannel(ECC_Pawn, ECR_Overlap);
	TriggerBox->SetGenerateOverlapEvents(true);

	CheckpointIndex = 0;
}

void ARacingCheckpoint::BeginPlay()
{
	Super::BeginPlay();
	TriggerBox->OnComponentBeginOverlap.AddDynamic(this, &ARacingCheckpoint::OnOverlapBegin);
}

void ARacingCheckpoint::OnOverlapBegin(UPrimitiveComponent* OverlappedComponent, AActor* OtherActor,
	UPrimitiveComponent* OtherComp, int32 OtherBodyIndex,
	bool bFromSweep, const FHitResult& SweepResult)
{
	ARacingVehiclePawn* Vehicle = Cast<ARacingVehiclePawn>(OtherActor);
	if (Vehicle)
	{
		OnCheckpointPassed.Broadcast(this, Vehicle);
	}
}
