# Racing Game - UE5 Editor Setup Guide

> **Project:** RacingGame (Unreal Engine 5.3, Chaos Vehicles)
> **Prerequisites:** Visual Studio 2022 with Game Development workload for C++

---

## 1. Opening the Project in UE5

1. **Right-click** `RacingGame.uproject` → **Generate Visual Studio project files** (or run from command line: `"C:\Program Files\Epic Games\UE_5.3\Engine\Binaries\DotNET\UnrealBuildTool\UnrealBuildTool.exe" -projectfiles -project="<full-path>\RacingGame.uproject" -game -engine`)
2. Open the generated `RacingGame.sln` in Visual Studio 2022
3. Set solution config to **Development Editor** and platform to **Win64**
4. **Build** the solution (`Ctrl+Shift+B` or Build → Build Solution)
5. After successful compile, **right-click** `RacingGame.uproject` → **Open with → Unreal Engine 5.3** (or launch from the `.sln`)
6. On first open, UE5 prompts: _"The following modules are missing or built with a different version..."_ → Click **Yes** to rebuild
7. Once the editor loads, go to **Edit → Project Settings → Maps & Modes** and verify defaults (we'll set these later)

---

## 2. Create the Vehicle Blueprint (BP_Vehicle)

### 2.1 Create Blueprint
1. In **Content Browser**, right-click → **Blueprint Class**
2. Search for and select **RacingVehiclePawn** (under `All Classes`)
3. Name it: `BP_Vehicle`
4. Save to `Content/Blueprints/`

### 2.2 Add Skeletal Mesh
1. Open `BP_Vehicle`
2. In **Components** panel, select the **Mesh (Inherited)** component
3. In **Details** panel → **Mesh** → **Skeletal Mesh**:
   - Click the dropdown and pick: `/Engine/Vehicles/SportsCar/SportsCar.SportsCar`
   - (Alternative path: `/Game/Vehicles/SportsCar/SportsCar` depending on your project)
4. Under **Transform**, set:
   - `Location`: `(X=0.0, Y=0.0, Z=-80.0)` — lowers mesh onto wheels
   - `Rotation`: `(0.0, 0.0, -90.0)` — aligns mesh forward
5. Under **Animation** → **Anim Class**:
   - Set to `/Engine/Vehicles/SportsCar/AnimClass/VehicleAnimBP.VehicleAnimBP_C` (if available)
   - Or create a simple Animation Blueprint from `VehicleAnimInstance`

### 2.3 Configure ChaosVehicleMovement
1. Select the **ChaosVehicleMovement** component (Inherited)
2. In **Details**, configure these categories:

**Wheel Setup:**
```
Wheels (Array)
  [0] WheelClass: /Engine/Vehicles/Physics/VehicleWheel.FrontWheel_C
      BoneName: "FL_Wheel"
      bDriven: true
      bSteerable: true
      bABSEnabled: true
  [1] WheelClass: /Engine/Vehicles/Physics/VehicleWheel.FrontWheel_C
      BoneName: "FR_Wheel"
      bDriven: true
      bSteerable: true
      bABSEnabled: true
  [2] WheelClass: /Engine/Vehicles/Physics/VehicleWheel.RearWheel_C
      BoneName: "RL_Wheel"
      bDriven: true
      bSteerable: false
      bABSEnabled: true
  [3] WheelClass: /Engine/Vehicles/Physics/VehicleWheel.RearWheel_C
      BoneName: "RR_Wheel"
      bDriven: true
      bSteerable: false
      bABSEnabled: true
```

**Engine:**
```
EngineSetup
  MaxRPM: 6000.0
  MaxTorque: 800.0
  TorqueCurve: (use default curve - ramps from 0 to 1)
```

**Transmission:**
```
TransmissionSetup
  bUseAutomaticGears: true
  GearChangeTime: 0.15
  ForwardGearRatio (Array)
    [0] Gear: 4.25  (1st)
    [1] Gear: 2.5   (2nd)
    [2] Gear: 1.7   (3rd)
    [3] Gear: 1.25  (4th)
    [4] Gear: 1.0   (5th)
    [5] Gear: 0.75  (6th)
  ReverseGearRatio: -4.0
  FinalRatio: 3.42
  ChangeDownRPM: 2000
  ChangeUpRPM: 5000
```

**Steering:**
```
SteeringSetup
  SteeringCurve: (linear curve, 0° at 0 km/h → max 40° at 100+ km/h)
  SteeringType: Standard (or AngleRatio)
  AckermannAccuracy: 0.85
```

**Brakes:**
```
BrakeSetup
  BrakeEffect: (default curve)
```

### 2.4 Configure Spring Arm & Camera
1. Select **SpringArm** (Inherited) component
2. In Details:
   - `Target Arm Length`: `600.0`
   - `Socket Offset`: `(X=0.0, Y=0.0, Z=100.0)`
   - `bEnable Camera Lag`: `true`
   - `Camera Lag Speed`: `5.0`
   - `bEnable Camera Rotation Lag`: `true`
   - `Camera Rotation Lag Speed`: `8.0`
   - `bDo Collision Test`: `true`
   - `Probe Size`: `12.0`
3. Select **Camera** (Inherited) component:
   - `Field of View`: `90.0`

### 2.5 Configure Engine Audio
1. Select **EngineAudio** (Inherited) component
2. In Details → **Audio**:
   - `Sound`: `/Engine/Vextures/SportsCar/Audio/SportsCarEngine.SportsCarEngine` (or any vehicle engine sound asset)
     - If it doesn't exist, import a .wav or use: right-click Content Browser → **Sounds** → create a simple engine loop
   - `bAuto Activate`: `true`
3. Under **Attenuation** → assign a `SoundAttenuation` asset to keep volume distance-based

### 2.6 CameraOffsets Array
1. With `BP_Vehicle` selected (self), find `CameraOffsets` under **Camera** category
2. Ensure the array has 3 entries:
   ```
   [0]: (X=0.0, Y=0.0, Z=100.0)   — Chase cam
   [1]: (X=-300.0, Y=0.0, Z=50.0)  — Close/bonnet cam
   [2]: (X=0.0, Y=0.0, Z=30.0)    — Cockpit cam
   ```

3. **Compile** and **Save** `BP_Vehicle`

---

## 3. Create the Track Blueprint (BP_Track)

### 3.1 Create Blueprint
1. Right-click in Content Browser → **Blueprint Class** → search for **RacingTrackSpline**
2. Name: `BP_Track`
3. Save to `Content/Blueprints/`

### 3.2 Add Spline Points
1. Open `BP_Track`
2. Select the **SplineComponent** (Inherited) in the Components panel
3. In the viewport, hold **Ctrl** and click to add spline points (create an oval/loop):
   - `Point 0`: `(X=0, Y=0, Z=0)` — start/finish
   - `Point 1`: `(X=2000, Y=-1000, Z=0)` — right curve
   - `Point 2`: `(X=4000, Y=0, Z=0)` — far straight
   - `Point 3`: `(X=3000, Y=2000, Z=0)` — left curve
   - `Point 4`: `(X=0, Y=2000, Z=0)` — far straight
   - `Point 5`: `(X=-1000, Y=1000, Z=0)` — curve back
4. Select each point and tweak **Tangents** for smooth curves:
   - Select a point → in Details under **Spline Point**:
     - `Arrive Tangent`: smooth values (e.g. `(500, 500, 0)`)
     - `Leave Tangent`: smooth values
5. **Crucial:** Enable **Closed Loop** on the SplineComponent:
   - With SplineComponent selected → Details → **Spline** → `bClosed Loop`: `true`

### 3.3 Set Track Properties
1. Select the **BP_Track** root (self) in Components
2. Under **Track** category:
   - `Num Laps`: `3`
   - `Track Width`: `800.0`
3. **Compile** and **Save**

---

## 4. Create Checkpoints (BP_Checkpoint)

### 4.1 Create Blueprint
1. Right-click → **Blueprint Class** → search for **RacingCheckpoint**
2. Name: `BP_Checkpoint`
3. Save to `Content/Blueprints/`

### 4.2 Configure Trigger Box
1. Open `BP_Checkpoint`
2. Select **TriggerBox** (Inherited) component
3. In Details → **Shape**:
   - `Box Extent`: `(X=100.0, Y=800.0, Z=300.0)`
     - Adjust `Y` to match your track width (e.g. 800 = track width)
     - Adjust `X` for depth (100 is good)
     - Adjust `Z` height to catch vehicles (300 is fine)
4. Under **Collision**:
   - `Collision Enabled`: `Query Only (No Physics Collision)`
   - `Object Type`: `WorldDynamic`
   - `Collision Responses`:
     - `Pawn`: `Overlap` (all others `Ignore`)

### 4.3 Add Visual Representation (optional but helpful)
1. Add a **Static Mesh** component as child of TriggerBox:
   - Use `/Engine/BasicShapes/Cube`
   - Set `Scale`: `(X=0.1, Y=1.0, Z=0.05)` — thin strip
   - Uncheck **Visible** in game (or set collision to make it invisible)
2. Or just leave it invisible — the trigger box works regardless

### 4.4 Place Checkpoints on the Track
1. Open the **RaceTrack** level (or create a new one, see Section 8)
2. Drag `BP_Checkpoint` into the level multiple times
3. Position them along the track at intervals:
   - `Checkpoint 1` (start/finish): `(X=0, Y=0, Z=100)` — rotation aligned to track start
   - `Checkpoint 2`: ~20% along the track
   - `Checkpoint 3`: ~40% along
   - `Checkpoint 4`: ~60% along
   - `Checkpoint 5`: ~80% along
4. For each checkpoint, set the **Rotation** so the green arrow (forward) points along the track direction, and the **Box Extent Y** covers the full track width
5. Select each `BP_Checkpoint` → under **Checkpoint** category:
   - Leave `Checkpoint Index` at `0` (it gets auto-assigned at runtime by `ARacingGameMode::SetupCheckpoints` based on the order in the Track's array)

### 4.5 Assign Checkpoints to Track
1. Select the **BP_Track** actor in the level
2. In Details → **Track** → **Checkpoints**:
   - Click the `+` (add) button
   - Add 5 entries
   - For each entry, pick the corresponding `BP_Checkpoint` actor from the level

---

## 5. Create the AI Controller Blueprint (BP_AI_Controller)

### 5.1 Create Blueprint
1. Right-click → **Blueprint Class** → search for **RacingAIVehicleController**
2. Name: `BP_AI_Controller`
3. Save to `Content/Blueprints/`

### 5.2 Configure AI Properties
1. Open `BP_AI_Controller`
2. Under **AI** category:
   - `Look Ahead Distance`: `500.0`
   - `Max Speed Kmh`: `250.0`
   - `Corner Brake Distance`: `800.0`
   - `Steering Sensitivity`: `1.5`
3. **Compile** and **Save**

---

## 6. Create the Game Mode Blueprint (BP_GameMode)

### 6.1 Create Blueprint
1. Right-click → **Blueprint Class** → search for **RacingGameMode**
2. Name: `BP_GameMode`
3. Save to `Content/Blueprints/`

### 6.2 Assign Classes
1. Open `BP_GameMode`
2. In Details → **Race**:
   - `AI Vehicle Class`: `BP_Vehicle` (pick from dropdown)
   - `AI Controller Class`: `BP_AI_Controller` (pick from dropdown)
   - `Number Of AI`: `3`
3. **Compile** and **Save**

---

## 7. Create the HUD Widget (WBP_HUD)

### 7.1 Create Widget Blueprint
1. Right-click in Content Browser → **User Interface → Widget Blueprint**
2. Name: `WBP_HUD`
3. Save to `Content/UI/`

### 7.2 Design Layout
1. Open `WBP_HUD` in the UMG Editor
2. Add the following elements to the **Canvas Panel**:

**Speed Text (bottom-center):**
- Drag a **Text Block** to the canvas
- Name: `SpeedText`
- Anchor: `Bottom Center`
- Position: `(X=0, Y=-100)`
- Text: `"0 km/h"`
- Font Size: `36`
- Color: `White` (with black outline or shadow)

**Lap Counter (top-left):**
- Drag a **Text Block**
- Name: `LapText`
- Anchor: `Top Left`
- Position: `(X=20, Y=20)`
- Text: `"Lap 1 / 3"`
- Font Size: `28`
- Color: `White`

**Position Text (top-right):**
- Drag a **Text Block**
- Name: `PositionText`
- Anchor: `Top Right`
- Position: `(X=-20, Y=20)`
- Text: `"Position: 1 / 4"`
- Font Size: `28`
- Color: `White`

**Countdown Text (center):**
- Drag a **Text Block**
- Name: `CountdownText`
- Anchor: `Center`
- Position: `(X=0, Y=0)`
- Text: `""` (empty by default)
- Font Size: `72`
- Color: `Yellow` (with shadow)
- **Visibility**: `Hidden` (set to Visible from blueprint when needed)

**Race Result Text (center):**
- Drag a **Text Block**
- Name: `ResultText`
- Anchor: `Center`
- Position: `(X=0, Y=100)`
- Text: `""`
- Font Size: `48`
- Color: `Gold`
- **Visibility**: `Hidden`

### 7.3 Implement UpdateHUD Event
1. In the **Graph** tab of WBP_HUD
2. Create a custom Event: name it `UpdateHUD`
   - Inputs: `Speed (float)`, `Lap (int)`, `TotalLaps (int)`, `Position (int)`, `TotalCars (int)`
3. Wire the event:
   - For **SpeedText**: `UpdateHUD` → `Get Speed` → `To Text (float)` → concatenate `" km/h"` → `Set Text (SpeedText)`
   - For **LapText**: `UpdateHUD` → `Format Text ("Lap {0} / {1}")` → inputs: Lap, TotalLaps → `Set Text (LapText)`
   - For **PositionText**: `UpdateHUD` → `Format Text ("Position: {0} / {1}")` → inputs: Position, TotalCars → `Set Text (PositionText)`
4. Create custom Event `ShowCountdown`:
   - Inputs: `TimeLeft (int)`
   - Set `CountdownText` visibility to **Visible**
   - `TimeLeft → To Text` → `Set Text (CountdownText)`
   - Delay `0.5s` → `Set Text ("Go!")` → Delay `1.0s` → Set visibility back to **Hidden**
5. Create custom Event `ShowRaceResult`:
   - Inputs: `FinalPosition (int)`, `RaceTime (float)`
   - `Format Text ("Race Finished!\nPosition: {0}\nTime: {1}s")` → inputs: FinalPosition, RaceTime → `Set Text (ResultText)`
   - Set `ResultText` visibility to **Visible**

### 7.4 Wire to Player Controller
The `ARacingPlayerController` has `BlueprintImplementableEvent` functions that get called automatically from C++:

**In BP_PlayerController (create from RacingPlayerController):**
1. Create a Blueprint from `RacingPlayerController` named `BP_PlayerController`
2. Open it → **Event Graph**
3. Right-click → **Implement Event → UpdateHUD**
   - Input nodes: `Speed`, `Lap`, `TotalLaps`, `Position`, `TotalCars`
   - Get HUD Widget: `Create Widget` or use a variable reference
   - Wire: Cast to `WBP_HUD` → call `UpdateHUD` on the widget, passing all 5 inputs
4. Right-click → **Implement Event → ShowCountdownOnHUD**
   - Input: `TimeLeft`
   - Same pattern: cast to HUD → call `ShowCountdown(TimeLeft)`
5. Right-click → **Implement Event → ShowRaceResultOnHUD**
   - Input: `FinalPosition`, `RaceTime`
   - Cast to HUD → call `ShowRaceResult(FinalPosition, RaceTime)`

6. In the **Event BeginPlay** of `BP_PlayerController`:
   - `Create Widget` → class: `WBP_HUD` → assign to a `WBP_HUD` variable
   - `Add to Viewport`

### 7.5 HUDWidgetClass Assignment
1. Open `BP_PlayerController`
2. Select the root (self) → Details → **UI**:
   - `HUD Widget Class`: `WBP_HUD`
   - `Pause Menu Class`: `WBP_PauseMenu` (create a simple one with Resume/Quit buttons)

---

## 8. Create Levels

### 8.1 RaceTrack Level
1. **File → New Level → Empty Level**
2. **Save** as: `RaceTrack` in `Content/Maps/`
3. Place elements:
   - Drag `BP_Track` into the world at `(0, 0, 0)`
   - Place a **PlayerStart** actor near the start/finish line:
     - Location: `(X=0, Y=400, Z=100)`
   - Place additional **PlayerStart** actors for AI:
     - `PlayerStart 2`: `(X=0, Y=800, Z=100)`
     - `PlayerStart 3`: `(X=0, Y=1200, Z=100)`
     - `PlayerStart 4`: `(X=0, Y=1600, Z=100)`
   - Add a **Directional Light** for lighting
   - Add a **Sky Sphere** or **BP_Sky_Sphere** for background

### 8.2 Configure Level GameMode
1. Open `RaceTrack` level
2. **Window → World Settings** (or click the Settings icon in toolbar)
3. In **World Settings** panel:
   - `Game Mode Override`: `BP_GameMode`
   - `Default Pawn Class`: `BP_Vehicle`
   - `Player Controller Class`: `BP_PlayerController`
   - `HUD Class`: leave default (or use BP_HUD if you created one)

### 8.3 MainMenu Level
1. **File → New Level → Empty Level**
2. **Save** as: `MainMenu` in `Content/Maps/`
3. Add a simple menu UI:
   - Create another Widget Blueprint: `WBP_MainMenu`
   - Add a **Button** "Start Race" → on click: `Open Level` by name `"RaceTrack"`
   - Add a **Button** "Quit" → on click: `Quit Game`
4. In **World Settings** for MainMenu:
   - `Game Mode Override`: leave blank (use default)
   - Or use a minimal `BP_MainMenuGameMode` (from `GameModeBase`) that sets `HUD Class` to a menu widget

### 8.4 Map References in Project Settings
1. Go to **Edit → Project Settings → Maps & Modes**
2. Set:
   - `Editor Startup Map`: `RaceTrack`
   - `Game Default Map`: `MainMenu`
   - `Server Default Map`: `RaceTrack`

---

## 9. Project Settings & DefaultGame.ini

The config is already partially set up. Verify/update these:

### 9.1 Edit → Project Settings → Project → Maps & Modes
- **Default Modes:**
  - `Default GameMode`: `BP_GameMode`
  - `Default Pawn Class`: `BP_Vehicle`
  - `Default HUD Class`: `RacingGameHUD`
  - `Default Player Controller Class`: `BP_PlayerController`
  - `Default Player State Class`: `RacingPlayerState`
  - `Default Game State Class`: `RacingGameState`

### 9.2 Edit → Project Settings → Engine → Input
Make sure these **Action Mappings** exist:

| Action Name      | Key        | Shift | Ctrl | Alt | Cmd |
|------------------|------------|-------|------|-----|-----|
| `Handbrake`      | `S`        | false | false| false| false|
| `ResetVehicle`   | `R`        | false | false| false| false|
| `ToggleCamera`   | `C`        | false | false| false| false|
| `Pause`          | `Escape`   | false | false| false| false|

And these **Axis Mappings**:

| Axis Name   | Key      | Scale |
|-------------|----------|-------|
| `Throttle`  | `W`      | 1.0   |
| `Throttle`  | `Up`     | 1.0   |
| `BrakeAxis` | `S`      | 1.0   |
| `BrakeAxis` | `Down`   | 1.0   |
| `Steer`     | `A`      | -1.0  |
| `Steer`     | `D`      | 1.0   |
| `Steer`     | `Left`   | -1.0  |
| `Steer`     | `Right`  | 1.0   |

> These are already in `Config/DefaultInput.ini` — verify they match.

### 9.3 Verify DefaultGame.ini overrides in `Config/DefaultGame.ini`:
```ini
[/Script/EngineSettings.GameMapsSettings]
GameDefaultMap=/Game/Maps/MainMenu
ServerDefaultMap=/Game/Maps/RaceTrack
EditorStartupMap=/Game/Maps/RaceTrack
GameModeClassOverride=/Script/RacingGame.RacingGameMode
HUDClass=/Script/RacingGame.RacingGameHUD
```

> **Note:** After creating the Blueprint versions (`BP_GameMode`, `BP_Vehicle`, etc.), you may want to update `DefaultGame.ini` to reference the Blueprint paths instead of C++ classes:
> ```ini
> GameModeClassOverride=/Game/Blueprints/BP_GameMode.BP_GameMode_C
> DefaultPawnClass=/Game/Blueprints/BP_Vehicle.BP_Vehicle_C
> HUDClass=/Script/RacingGame.RacingGameHUD
> PlayerStateClass=/Script/RacingGame.RacingPlayerState
> GameStateClass=/Script/RacingGame.RacingGameState
> ```

### 9.4 Verify Chaos Vehicles Plugin
Go to **Edit → Plugins** → search for "ChaosVehicles" — ensure it is **Enabled**. (It's already enabled in `.uproject`.)

---

## 10. Testing the Game

### 10.1 In-Editor Test
1. Open the **RaceTrack** level
2. Click **Play** (or **Alt+P**)
3. Controls:
   - `W / Up Arrow`: Throttle
   - `S / Down Arrow`: Brake
   - `A / D / Left / Right`: Steer
   - `SpaceBar`: Handbrake
   - `R`: Reset vehicle
   - `C`: Toggle camera view
   - `Escape`: Pause

### 10.2 Verify Checklist
- [ ] Vehicle accelerates and brakes properly
- [ ] Steering feels responsive
- [ ] AI vehicles spawn and drive along the track
- [ ] Checkpoints trigger lap counting
- [ ] HUD shows speed / lap / position
- [ ] Race ends after completing all laps
- [ ] Camera toggle switches views
- [ ] Handbrake allows drifting
- [ ] Countdown sequence plays at race start

### 10.3 Tuning Tips
- **Vehicle too slow?** Increase `MaxTorque` in `ChaosVehicleMovement` → `EngineSetup`
- **Vehicle slides too much?** Increase tire friction via the Wheel Blueprint's `TireConfig`
- **AI too fast/slow?** Adjust `MaxSpeedKmh` (250 default) and `DifficultyMultiplier` in `BP_AI_Controller`
- **Camera too shaky?** Reduce `CameraLagSpeed` or increase `CameraRotationLagSpeed`
- **Wrong checkpoint order?** Verify the `Checkpoints` array order in `BP_Track` matches the physical layout order

---

## Folder Structure (Expected after setup)

```
Content/
  Blueprints/
    BP_Vehicle.uasset
    BP_Track.uasset
    BP_Checkpoint.uasset
    BP_AI_Controller.uasset
    BP_GameMode.uasset
    BP_PlayerController.uasset
  UI/
    WBP_HUD.uasset
    WBP_MainMenu.uasset
    WBP_PauseMenu.uasset
  Maps/
    RaceTrack.uasset
    MainMenu.uasset
```

---

## Troubleshooting

**"Cannot find ChaosVehicleMovement" error:**
- Ensure `ChaosVehicles` plugin is enabled in **Edit → Plugins**
- Rebuild C++ code if module references changed

**Vehicles fall through floor:**
- Add a static mesh floor/ground to the level or ensure vehicles start above Z=0

**AI vehicles don't move:**
- Verify `BP_AI_Controller` has `BP_Vehicle` set as `AI Vehicle Class` in `BP_GameMode`
- Check that AI vehicles can find the `BP_Track` in the level (only one should exist)

**HUD not showing:**
- Verify `WBP_HUD` is assigned to `HUDWidgetClass` in `BP_PlayerController`
- Call `UpdateHUD` after widget creation via the `BlueprintImplementableEvent`
