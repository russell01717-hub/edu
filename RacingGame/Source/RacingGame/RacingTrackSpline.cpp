#include "RacingTrackSpline.h"
#include "RacingCheckpoint.h"

ARacingTrackSpline::ARacingTrackSpline()
{
	PrimaryActorTick.bCanEverTick = false;

	SplineComponent = CreateDefaultSubobject<USplineComponent>(TEXT("SplineComponent"));
	RootComponent = SplineComponent;

	NumLaps = 3;
	TrackWidth = 800.0f;
}

void ARacingTrackSpline::OnConstruction(const FTransform& Transform)
{
	Super::OnConstruction(Transform);
}

void ARacingTrackSpline::BeginPlay()
{
	Super::BeginPlay();
}

FVector ARacingTrackSpline::GetSplineLocationAtDistance(float Distance) const
{
	return SplineComponent->GetLocationAtDistanceAlongSpline(Distance, ESplineCoordinateSpace::World);
}

FRotator ARacingTrackSpline::GetSplineRotationAtDistance(float Distance) const
{
	return SplineComponent->GetRotationAtDistanceAlongSpline(Distance, ESplineCoordinateSpace::World);
}

float ARacingTrackSpline::GetTrackLength() const
{
	return SplineComponent->GetSplineLength();
}

FVector ARacingTrackSpline::GetClosestPointOnSpline(const FVector& WorldLocation) const
{
	return SplineComponent->FindLocationClosestToWorldLocation(WorldLocation, ESplineCoordinateSpace::World);
}

float ARacingTrackSpline::GetDistanceAlongSpline(const FVector& WorldLocation) const
{
	return SplineComponent->FindInputKeyClosestToWorldLocation(WorldLocation);
}

FVector ARacingTrackSpline::GetSplineDirectionAtDistance(float Distance) const
{
	return SplineComponent->GetDirectionAtDistanceAlongSpline(Distance, ESplineCoordinateSpace::World);
}

TArray<FVector> ARacingTrackSpline::GetSplineWaypoints(int32 NumPoints) const
{
	TArray<FVector> Points;
	float Length = GetTrackLength();
	float Step = Length / FMath::Max(NumPoints, 1);

	for (int32 i = 0; i < NumPoints; i++)
	{
		float Dist = Step * i;
		Points.Add(GetSplineLocationAtDistance(Dist));
	}

	return Points;
}
