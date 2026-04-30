# Termux Deployment Sequence — Clarity Gap Scene Integration v0.2.0

1. Place archive in Android Downloads:
   `/storage/emulated/0/Download/clarity_gap_scene_integration_pack_v0_2_0.zip`

2. Run the deployment function from the assistant response.

3. Confirm:
   - local patch QA passes;
   - diagnostic script passes locally;
   - commit pushes to origin/main;
   - live index contains `GL_BUILD_CLARITY_GAP_SCENE=0.2.0`;
   - live CSS contains `CLARITY_GAP_SCENE_INTEGRATION_v0_2_0`.

4. Open:
   `https://goldlevel.co.uk/lifecoachlanding/index.html?cb=0.2.0`
