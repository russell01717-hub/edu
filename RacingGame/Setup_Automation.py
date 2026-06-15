"""
RacingGame - UE5 Editor Automation Script
Run in UE5: Window > Developer Tools > Python Console > py "RacingGame/Setup_Automation.py"
"""

import unreal
import sys
import os

# ============================================================
# CONFIG
# ============================================================
CONTENT_DIR = "/Game"
MAP_NAME = "RaceTrack"
MAIN_MENU_NAME = "MainMenu"
NUM_LAPS = 3
TRACK_WIDTH = 800.0
AI_COUNT = 3
SPLINE_POINTS_XY = [
    (0, 0), (1000, 500), (2000, 2000), (1500, 3500),
    (0, 4000), (-1500, 3500), (-2000, 2000), (-1000, 500)
]

asset_tools = unreal.AssetToolsHelpers.get_asset_tools()
asset_lib = unreal.EditorAssetLibrary()
level_subsys = unreal.LevelEditorSubsystem()
actor_subsys = unreal.get_editor_subsystem(unreal.EditorActorSubsystem)


def log(msg):
    unreal.log("[RacingSetup] " + msg)
    print("[RacingSetup] " + msg)


def find_cpp_class(class_name):
    """Find a C++ class by name."""
    all_classes = unreal.EditorAssetLibrary.load_blueprint_class("/Script/RacingGame." + class_name)
    return all_classes


def create_bp(asset_name, package_path, parent_class):
    """Create a Blueprint from a C++ parent class."""
    factory = unreal.BlueprintFactory()
    factory.set_editor_property("ParentClass", parent_class)
    path = package_path + "/" + asset_name
    if asset_lib.does_asset_exist(path):
        log(f"Asset already exists: {path}")
        return asset_lib.load_asset(path)

    bp = asset_tools.create_asset(asset_name, package_path, None, factory)
    if bp:
        log(f"Created Blueprint: {path}")
    return bp


def compile_bp(bp):
    """Compile a Blueprint."""
    unreal.BlueprintEditorUtils.compile_blueprint(bp)
    log(f"Compiled: {bp.get_path_name()}")


def save_asset(asset):
    """Save an asset."""
    path = asset.get_path_name()
    asset_lib.save_asset(path)
    log(f"Saved: {path}")


def add_component(bp, component_class, name):
    """Add a component to a Blueprint."""
    component = unreal.BlueprintEditorUtils.add_component(bp, component_class, name)
    log(f"Added component {name} ({component_class}) to {bp.get_name()}")
    return component


def get_bp_defaults(bp):
    """Get default object of a Blueprint."""
    return unreal.BlueprintEditorUtils.get_blueprint_defaults(bp)


# ============================================================
# 1. CREATE VEHICLE BLUEPRINT
# ============================================================
def create_vehicle_bp():
    log("\n=== Creating Vehicle Blueprint ===")
    parent = find_cpp_class("RacingVehiclePawn")
    if not parent:
        log("ERROR: RacingVehiclePawn C++ class not found!")
        return None

    bp = create_bp("BP_RacingVehicle", CONTENT_DIR + "/Vehicles", parent)
    if not bp:
        return None

    generated_class = unreal.BlueprintEditorUtils.get_blueprint_generated_class(bp)
    defaults = get_bp_defaults(bp)

    skeletal_mesh = add_component(bp, "SkeletalMeshComponent", "VehicleMesh")
    skeletal_mesh.set_editor_property("skeletal_mesh", None)
    defaults.set_editor_property("SkeletalMesh", None)

    spring_arm = add_component(bp, "SpringArmComponent", "SpringArm")
    spring_arm.set_editor_property("TargetArmLength", 600.0)
    spring_arm.set_editor_property("SocketOffset", unreal.Vector(0.0, 0.0, 100.0))
    spring_arm.set_editor_property("bEnableCameraLag", True)
    spring_arm.set_editor_property("CameraLagSpeed", 5.0)
    spring_arm.set_editor_property("bEnableCameraRotationLag", True)
    spring_arm.set_editor_property("CameraRotationLagSpeed", 8.0)
    spring_arm.set_editor_property("bDoCollisionTest", True)

    camera = add_component(bp, "CameraComponent", "Camera")
    camera.set_editor_property("FieldOfView", 90.0)
    camera.attach_to(spring_arm, "Socket")

    audio = add_component(bp, "AudioComponent", "EngineAudio")
    audio.attach_to(skeletal_mesh)

    defaults.set_editor_property("CameraOffsets", [
        unreal.Vector(0.0, 0.0, 100.0),
        unreal.Vector(-300.0, 0.0, 50.0),
        unreal.Vector(0.0, 0.0, 30.0)
    ])

    compile_bp(bp)
    save_asset(bp)
    log("Vehicle BP created successfully!")
    return bp


# ============================================================
# 2. CREATE AI CONTROLLER BLUEPRINT
# ============================================================
def create_ai_controller_bp():
    log("\n=== Creating AI Controller Blueprint ===")
    parent = find_cpp_class("RacingAIVehicleController")
    if not parent:
        log("ERROR: RacingAIVehicleController C++ class not found!")
        return None

    bp = create_bp("BP_AIVehicleController", CONTENT_DIR + "/Vehicles", parent)
    if not bp:
        return None

    defaults = get_bp_defaults(bp)
    defaults.set_editor_property("LookAheadDistance", 500.0)
    defaults.set_editor_property("MaxSpeedKmh", 250.0)
    defaults.set_editor_property("CornerBrakeDistance", 800.0)
    defaults.set_editor_property("SteeringSensitivity", 1.5)

    compile_bp(bp)
    save_asset(bp)
    log("AI Controller BP created!")
    return bp


# ============================================================
# 3. CREATE TRACK SPLINE BLUEPRINT
# ============================================================
def create_track_bp():
    log("\n=== Creating Track Blueprint ===")
    parent = find_cpp_class("RacingTrackSpline")
    if not parent:
        log("ERROR: RacingTrackSpline C++ class not found!")
        return None

    bp = create_bp("BP_RaceTrack", CONTENT_DIR + "/Tracks", parent)
    if not bp:
        return None

    defaults = get_bp_defaults(bp)
    defaults.set_editor_property("NumLaps", NUM_LAPS)
    defaults.set_editor_property("TrackWidth", TRACK_WIDTH)

    spline = add_component(bp, "SplineComponent", "SplineComponent")
    spline.set_editor_property("closed_loop", True)
    spline.set_editor_property("draw_debug", True)

    for idx, (x, y) in enumerate(SPLINE_POINTS_XY):
        point = unreal.SplinePoint()
        point.location = unreal.Vector(x, y, 0.0)
        point.arrive_tangent = unreal.Vector(0, 0, 0)
        point.leave_tangent = unreal.Vector(0, 0, 0)
        point.type = unreal.ESplinePointType.CURVE_CUSTOM
        spline.add_point(point)

    compile_bp(bp)
    save_asset(bp)
    log("Track BP created with {} spline points!".format(len(SPLINE_POINTS_XY)))
    return bp


# ============================================================
# 4. CREATE CHECKPOINT BLUEPRINT
# ============================================================
def create_checkpoint_bp():
    log("\n=== Creating Checkpoint Blueprint ===")
    parent = find_cpp_class("RacingCheckpoint")
    if not parent:
        log("ERROR: RacingCheckpoint C++ class not found!")
        return None

    bp = create_bp("BP_Checkpoint", CONTENT_DIR + "/Tracks", parent)
    if not bp:
        return None

    box = add_component(bp, "BoxComponent", "TriggerBox")
    box.set_editor_property("BoxExtent", unreal.Vector(100.0, 800.0, 300.0))
    box.set_collision_enabled(unreal.CollisionEnabled.QUERY_ONLY)
    box.set_collision_response_to_channel(unreal.ECC_Pawn, unreal.ECR_Overlap)

    defaults = get_bp_defaults(bp)
    defaults.set_editor_property("CheckpointIndex", 0)

    compile_bp(bp)
    save_asset(bp)
    log("Checkpoint BP created!")
    return bp


# ============================================================
# 5. CREATE GAME MODE BLUEPRINT
# ============================================================
def create_gamemode_bp():
    log("\n=== Creating Game Mode Blueprint ===")
    parent = find_cpp_class("RacingGameMode")
    if not parent:
        log("ERROR: RacingGameMode C++ class not found!")
        return None

    bp = create_bp("BP_RacingGameMode", CONTENT_DIR + "/GameMode", parent)
    if not bp:
        return None

    defaults = get_bp_defaults(bp)
    defaults.set_editor_property("NumberOfAI", AI_COUNT)

    vehicle_bp = asset_lib.load_asset(CONTENT_DIR + "/Vehicles/BP_RacingVehicle")
    ai_ctrl_bp = asset_lib.load_asset(CONTENT_DIR + "/Vehicles/BP_AIVehicleController")

    if vehicle_bp:
        cls = unreal.BlueprintEditorUtils.get_blueprint_generated_class(vehicle_bp)
        defaults.set_editor_property("AIVehicleClass", cls)
    if ai_ctrl_bp:
        cls = unreal.BlueprintEditorUtils.get_blueprint_generated_class(ai_ctrl_bp)
        defaults.set_editor_property("AIControllerClass", cls)

    compile_bp(bp)
    save_asset(bp)
    log("Game Mode BP created!")
    return bp


# ============================================================
# 6. CREATE HUD WIDGET
# ============================================================
def create_hud_widget():
    log("\n=== Creating HUD Widget ===")
    factory = unreal.WidgetBlueprintFactory()
    path = CONTENT_DIR + "/UI/WBP_RacingHUD"
    if asset_lib.does_asset_exist(path):
        log("HUD Widget already exists: " + path)
        return asset_lib.load_asset(path)

    widget = asset_tools.create_asset("WBP_RacingHUD", CONTENT_DIR + "/UI", None, factory)
    if widget:
        log("Created HUD Widget Blueprint")
        save_asset(widget)
        log("NOTE: Open WBP_RacingHUD in UMG Editor and add TextBlocks manually.")
        log("      Bind them to UpdateHUD, ShowCountdownOnHUD, ShowRaceResultOnHUD events.")
    return widget


# ============================================================
# 7. CREATE / SETUP LEVEL
# ============================================================
def create_level(level_name, gamemode_bp=None):
    log("\n=== Creating Level: " + level_name + " ===")
    level_path = CONTENT_DIR + "/Maps/" + level_name

    if asset_lib.does_asset_exist(level_path):
        log("Level already exists: " + level_path)
        return level_lib.load_asset(level_path)

    world = level_subsys.new_level(level_path)
    if not world:
        log("ERROR: Could not create level!")
        return None

    if gamemode_bp:
        world.set_editor_property("game_mode", gamemode_bp)

    log("Level created: " + level_path)
    return world


def setup_race_level():
    log("\n=== Setting up Race Level ===")
    world = level_subsys.load_level(CONTENT_DIR + "/Maps/" + MAP_NAME)
    if not world:
        log("ERROR: Could not load RaceTrack level!")
        return

    track_asset = asset_lib.load_asset(CONTENT_DIR + "/Tracks/BP_RaceTrack")
    if track_asset:
        track_class = unreal.BlueprintEditorUtils.get_blueprint_generated_class(track_asset)
        track_actor = actor_subsys.spawn_actor_from_class(track_class, unreal.Vector(0, 0, 0))
        log("Track placed in level at (0, 0, 0)")

        spline = track_actor.get_component_by_class(unreal.SplineComponent.static_class())
        if spline:
            spline.set_editor_property("closed_loop", True)
            spline.set_editor_property("draw_debug", True)

    player_start = actor_subsys.spawn_actor_from_class(
        unreal.PlayerStart.static_class(), unreal.Vector(0, -200, 100))
    log("PlayerStart placed")

    for i in range(AI_COUNT):
        ps = actor_subsys.spawn_actor_from_class(
            unreal.PlayerStart.static_class(),
            unreal.Vector(0, 300 + i * 400, 100))
        ps.set_actor_label("AI_Start_" + str(i))
    log("AI Start positions placed")

    cp_asset = asset_lib.load_asset(CONTENT_DIR + "/Tracks/BP_Checkpoint")
    if cp_asset:
        cp_class = unreal.BlueprintEditorUtils.get_blueprint_generated_class(cp_asset)
        num_points = len(SPLINE_POINTS_XY)
        checkpoints = []
        for i in range(num_points):
            x, y = SPLINE_POINTS_XY[i]
            next_x, next_y = SPLINE_POINTS_XY[(i + 1) % num_points]
            mid_x = (x + next_x) / 2.0
            mid_y = (y + next_y) / 2.0
            cp = actor_subsys.spawn_actor_from_class(
                cp_class, unreal.Vector(mid_x, mid_y, 50))
            cp.set_actor_label("Checkpoint_" + str(i))
            checkpoints.append(cp)

            defaults = get_bp_defaults(cp)
            defaults.set_editor_property("CheckpointIndex", i)

        log("{} Checkpoints placed".format(num_points))

    level_subsys.save_current_level()
    log("RaceTrack level saved!")

    world.set_editor_property("game_mode",
        unreal.load_asset(CONTENT_DIR + "/GameMode/BP_RacingGameMode"))
    save_asset(world)


# ============================================================
# 8. PROJECT SETTINGS
# ============================================================
def setup_project_settings():
    log("\n=== Configuring Project Settings ===")
    settings = unreal.get_editor_subsystem(unreal.ProjectSettingsSubsystem)

    maps_settings = unreal.get_default_object(unreal.GameMapsSettings)
    maps_settings.set_editor_property("GameDefaultMap", CONTENT_DIR + "/Maps/" + MAIN_MENU_NAME)
    maps_settings.set_editor_property("ServerDefaultMap", CONTENT_DIR + "/Maps/" + MAP_NAME)
    maps_settings.set_editor_property("EditorStartupMap", CONTENT_DIR + "/Maps/" + MAP_NAME)
    log("Default maps configured")

    input_settings = unreal.InputSettings.get_default_object()
    keys_exist = {}
    for action in input_settings.ActionMappings:
        keys_exist[action.ActionName] = True

    if "Brake" not in keys_exist:
        input_settings.ActionMappings = [
            unreal.InputActionKeyMapping("Brake", False, False, False, False, "SpaceBar"),
            unreal.InputActionKeyMapping("Handbrake", False, False, False, False, "S"),
            unreal.InputActionKeyMapping("ResetVehicle", False, False, False, False, "R"),
            unreal.InputActionKeyMapping("ToggleCamera", False, False, False, False, "C"),
            unreal.InputActionKeyMapping("Pause", False, False, False, False, "Escape"),
        ] + list(input_settings.ActionMappings)

    log("Input mappings configured")

    real_version_anchor = unreal.SystemLibrary.get_engine_version()
    log("Project settings updated for UE " + str(real_version_anchor))


# ============================================================
# MAIN
# ============================================================
def run():
    log("========================================")
    log("RacingGame UE5 Automation Script Started")
    log("========================================")

    # Create directories
    for dir_path in ["/Game/Vehicles", "/Game/Tracks", "/Game/GameMode", "/Game/UI", "/Game/Maps"]:
        if not asset_lib.does_directory_exist(dir_path):
            asset_lib.make_directory(dir_path)
            log("Created directory: " + dir_path)

    # Step 1: Blueprints
    vehicle_bp = create_vehicle_bp()
    ai_ctrl_bp = create_ai_controller_bp()
    track_bp = create_track_bp()
    checkpoint_bp = create_checkpoint_bp()
    gamemode_bp = create_gamemode_bp()
    hud_widget = create_hud_widget()

    # Step 2: Levels
    create_level(MAIN_MENU_NAME)
    create_level(MAP_NAME, gamemode_bp)
    setup_race_level()

    # Step 3: Project settings
    setup_project_settings()

    log("\n========================================")
    log("AUTOMATION COMPLETE!")
    log("========================================")
    log("")
    log("Manual steps remaining:")
    log("1. Open BP_RacingVehicle and set VehicleMesh->SkeletalMesh to a car mesh")
    log("   (e.g., /Engine/Vehicles/SportsCar/SportsCar.SportsCar)")
    log("2. Open BP_RaceTrack and adjust spline points visually")
    log("3. Open WBP_RacingHUD and create UMG layout (TextBlocks for speed, lap, pos)")
    log("4. Bind WBP_RacingHUD to RacingPlayerController->HUDWidgetClass")
    log("5. Assign BP_RacingGameMode->DefaultPawnClass = BP_RacingVehicle")
    log("   and DefaultPlayerControllerClass = BP_RacingPlayerController")
    log("")
    log("Press Play to test!")

if __name__ == "__main__":
    run()
