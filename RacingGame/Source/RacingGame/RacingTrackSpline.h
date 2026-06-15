#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "Components/SplineComponent.h"
#include "RacingTrackSpline.generated.h"

class ARacingCheckpoint;

UCLASS()
class RACINGGAME_API ARacingTrackSpline : public AActor
{
	GENERATED_BODY()

public:
	ARacingTrackSpline();

	virtual void OnConstruction(const FTransform& Transform) override;

	UFUNCTION(BlueprintCallable, Category = "Track")
	FVector GetSplineLocationAtDistance(float Distance) const;

	UFUNCTION(BlueprintCallable, Category = "Track")
	FRotator GetSplineRotationAtDistance(float Distance) const;

	UFUNCTION(BlueprintCallable, Category = "Track")
	float GetTrackLength() const;

	UFUNCTION(BlueprintCallable, Category = "Track")
	FVector GetClosestPointOnSpline(const FVector& WorldLocation) const;

	UFUNCTION(BlueprintCallable, Category = "Track")
	float GetDistanceAlongSpline(const FVector& WorldLocation) const;

	UFUNCTION(BlueprintCallable, Category = "Track")
	FVector GetSplineDirectionAtDistance(float Distance) const;

	UFUNCTION(BlueprintCallable, Category = "Track")
	TArray<FVector> GetSplineWaypoints(int32 NumPoints) const;

	UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Track")
	USplineComponent* SplineComponent;

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Track")
	TArray<TObjectPtr<ARacingCheckpoint>> Checkpoints;

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Track")
	int32 NumLaps;

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Track")
	float TrackWidth;

protected:
	virtual void BeginPlay() override;
};
