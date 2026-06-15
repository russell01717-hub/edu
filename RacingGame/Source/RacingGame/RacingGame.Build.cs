using UnrealBuildTool;

public class RacingGame : ModuleRules
{
	public RacingGame(ReadOnlyTargetRules Target) : base(Target)
	{
		PCHUsage = PCHUsageMode.UseExplicitOrSharedPCHs;

		PublicDependencyModuleNames.AddRange(new string[]
		{
			"Core",
			"CoreUObject",
			"Engine",
			"InputCore",
			"ChaosVehicles",
			"ChaosVehicleMovement",
			"UMG",
			"Slate",
			"SlateCore",
			"AIModule",
			"GameplayTasks"
		});
	}
}
