# The Archetype Atlas: NBA player roles, 2025–26

The Archetype Atlas groups **389 NBA players with at least 500 regular-season minutes** by the statistical roles they played. It assigns each player to one of seven archetypes: two for high-usage players and five for role players. These labels describe playing style, not overall quality. The [interactive atlas](web/index.html) presents the groups, and the [player fit table](web/player-fit.html) lets readers inspect every player's relative fit scores.

The [final clustering notebook](notebooks/final_archetype_clustering.ipynb) is the authoritative, executable record of the model. It starts from the saved modeling table, shows each modeling step in order, and writes the assignments and diagnostics used by the site.

## Project workflow

1. **Prepare a player-season table.** The saved [modeling input](data/processed/modeling_players.csv) contains one row per eligible player and derived box-score, shot-profile, catch-and-shoot, and passing measures. Its minimum recorded playing time is 500 minutes. The repository also retains [raw data snapshots](data/raw/) and [source metadata](data/raw/nba_2025_26_regular_season.metadata.json). The final notebook consumes the prepared table; it does not regenerate it from raw downloads.
2. **Separate modeling pools.** Players with usage of **25% or more** enter the high-usage pool (65 players). The remaining 324 enter the role-player pool. Each pool has its own feature set, scaling, and K-means fit, so a high-volume offensive creator does not define the geometry of the specialist groups.
3. **Transform role features.** Within each pool, cap every selected feature at that pool's 1st and 99th percentiles, standardize it, then apply the feature-family weights described below. All selected feature values must be present; the notebook raises an error if any are missing.
4. **Fit and name clusters.** Fit two high-usage clusters and select the role-player cluster count from K = 5–12. Name clusters from their aggregate statistical profiles after fitting; listed position does not choose an assignment.
5. **Assess and export the model.** Record silhouette scores, cluster sizes, an 80% subsample stability check, assignments, and within-pool fit scores. The notebook writes the final CSV and JSON files in [`data/processed/`](data/processed/).
6. **Build the website data.** [`web/build_data.py`](web/build_data.py) combines final assignments with the saved Basketball Index LEBRON snapshot for impact leaderboards. It also packages the fit scores for the browser. The site is static HTML, CSS, and JavaScript.

## Data and tools

The raw regular-season [source record](data/raw/nba_2025_26_regular_season.metadata.json) identifies Basketball Reference totals, advanced, and shooting tables, an NBA catch-and-shoot snapshot, and a passing snapshot. The [position file](data/raw/nba_2025_26_player_positions.csv) is merged one-to-one by player name when the notebook runs; position is retained in the outputs for display. The saved [modeling table](data/processed/modeling_players.csv) is the input required to reproduce the published clusters. It includes usage percentage, per-36 counting rates, shot-location rates, catch-and-shoot measures, and passing measures. The raw-to-modeling-table preparation is not an executable stage of this repository.

The notebook uses **pandas** for tables, **NumPy** for numerical arrays, and **scikit-learn** for standardization, K-means, silhouette scores, and adjusted Rand index. The site builder uses pandas and Python's JSON tools. The browser interface uses plain JavaScript, HTML, and CSS; it does not rerun the model.

[`requirements.txt`](requirements.txt) lists the Python dependencies. From the repository root, install them if needed, open [`notebooks/final_archetype_clustering.ipynb`](notebooks/final_archetype_clustering.ipynb) in Jupyter, and run all cells in order. The notebook also works when launched from `notebooks/`. It rewrites the three processed model outputs listed below. Then refresh the site's generated data:

```bash
python web/build_data.py
```

Open [`web/index.html`](web/index.html) locally to view the atlas. The page itself needs no build server. Web fonts and NBA-hosted player portraits require an internet connection.

## Feature preparation and weighting

Both models use the same transformation order. For each selected feature, the notebook calculates the 1st and 99th percentile **within that modeling pool** and clips values to those bounds. `StandardScaler` then centers and scales the capped feature. Finally, every column in a feature family is multiplied by that family's weight divided by the square root of its number of columns. This keeps a four-column family from receiving four times the influence of a one-column family merely because it has more columns. The weights encode which kinds of basketball activity matter most to the role descriptions; they are fixed before fitting.

The **high-usage model** uses these families and final weights:

- **Scoring volume, 1.25:** field-goal attempts per 36 minutes and free-throw attempt rate.
- **Shot location, 1.00:** three-point, rim, short-midrange, and long-midrange rates.
- **Playmaking, 1.30:** assists per 36 minutes and assist-to-turnover ratio. The notebook calculates the ratio from each player's saved assist and turnover rates and requires a positive turnover rate.
- **Passing context, 0.70:** passes made, potential assists, adjusted assists, and assist points created, each per 36 minutes.
- **Frontcourt involvement, 0.90:** offensive rebounds, defensive rebounds, and blocks per 36 minutes.

The **role-player model** uses a different set of families and final weights:

- **Secondary scoring volume, 1.10:** field-goal attempts per 36 minutes.
- **Shot profile, 0.90:** three-point, free-throw attempt, rim, and short-midrange rates.
- **Rebounding, 0.80:** offensive and defensive rebounds per 36 minutes.
- **Defensive activity, 1.40:** steals, blocks, and defensive win shares per 36 minutes, plus defensive box plus/minus (`DBPM`).
- **Catch-and-shoot, 0.85:** catch-and-shoot attempts per 36 minutes and catch-and-shoot share of field-goal attempts.
- **Secondary creation, 1.05:** assists and turnovers per 36 minutes.
- **Passing context, 0.70:** the same four per-36 passing measures used by the high-usage model.

Per-36 rates put counting statistics on a common playing-time scale; shot rates and shares describe how attempts are distributed. Neither the player's listed position nor LEBRON is a clustering feature.

## Clustering and archetype names

### High-usage players

The notebook fits one **two-cluster K-means** model to all 65 high-usage players, with `random_state=7` and `n_init=50`. K-means assigns each player to the nearest centroid in the weighted, standardized feature space. The cluster with the higher mean assists per 36 minutes is **Primary Playmakers** (26 players); the other is **Primary Scorers** (39 players). The high-usage silhouette score is **0.218**.

### Role players

All 324 role players enter one K-means model. The notebook fits candidates from **K = 5 through 12**, each with `random_state=2` and `n_init=50`. It calculates each candidate's silhouette score and smallest cluster share, requires the smallest cluster to contain at least **4%** of the role-player pool, and selects the eligible candidate with the highest silhouette score. A tie goes to the smaller K. All eight current candidates meet the minimum-share rule; **K = 5** has the highest silhouette score, **0.151**. The notebook asserts that the selected K is five so the naming logic cannot silently label a different number of groups.

Names are assigned after fitting from the mean traits of each cluster. Among the remaining unnamed clusters, the notebook selects the highest rim-attempt rate for **Rim-Runners** (48 players), then the highest assists per 36 for **Secondary Facilitators** (60), then the highest field-goal attempts per 36 for **Secondary Scorers** (65), then the highest DBPM for **3-and-D Contributors** (63). The remaining cluster is **Spot-Up Shooters** (88). The notebook also checks that the 3-and-D cluster's mean three-point attempt rate exceeds 0.45. These rules name whole clusters; they do not override individual assignments.

The names summarize cluster tendencies, not a checklist every member must satisfy. In particular, steals, blocks, defensive win shares, and DBPM are limited statistical proxies for defense. A silhouette score of 0.151 also indicates that the role-player groups are not sharply separated in this feature space.

## Stability and relative fit

For a stability diagnostic, the notebook draws **20 subsamples containing 80% of role players**, refits the selected K-means model on each one with `n_init=25`, and compares those labels with the final model's labels for the same sampled players using **adjusted Rand index**. The mean score is **0.710**. This diagnostic describes assignment consistency under subsampling; it does not change the selected model or any player's assignment.

For the player fit table, the notebook measures each player's Euclidean distance `d` to every centroid **in that player's own pool** and computes an inverse-square share:

```text
fit for cluster j = 100 × (1 / max(d_j, 1e-9)^2) / sum_over_clusters(1 / max(d, 1e-9)^2)
```

The shares total 100% before rounding. Published values are rounded to two decimals, so a displayed row may differ slightly from 100%. The assigned cluster remains the K-means nearest-centroid label. A fit percentage is a relative distance-based similarity measure, **not** the probability that a label is correct and not a Pearson correlation. Because the two pools use different features and scalers, compare scores only within a player's pool; the other pool's score columns are blank.

## Outputs and site presentation

Running the notebook writes three model artifacts:

- [`data/processed/current_player_archetypes.csv`](data/processed/current_player_archetypes.csv): one row per player with listed position, usage, modeling pool, numeric cluster ID, and archetype name.
- [`data/processed/player_cluster_fit.csv`](data/processed/player_cluster_fit.csv): within-pool fit shares for all eligible archetypes and the share of each player's assigned archetype.
- [`data/processed/current_archetype_metadata.json`](data/processed/current_archetype_metadata.json): final weights, K selection results, silhouette scores, cluster counts and means, and the stability diagnostic.

The site builder reads those outputs and the saved [LEBRON CSV](data/raw/nba_2025_26_lebron.csv) and [player metadata JSON](data/raw/nba_2025_26_lebron.json). For each archetype it selects the ten members with the highest LEBRON values (using LEBRON WAR to break ties), computes the group's median LEBRON, and selects three representatives with the highest **assigned fit**. Those representatives supply the archetype-card portraits. It writes [`web/data.js`](web/data.js) and [`web/fit-data.js`](web/fit-data.js), which the static pages load directly.

LEBRON is Basketball Index's estimate of on-court impact per 100 possessions. It determines the **displayed impact ranking only**; it is not part of the clustering or fit calculation. The [atlas](web/index.html) shows the seven groups, representatives, group sizes, median LEBRON, and impact leaderboards. The [full player table](web/player-fit.html) supports pool switching, search, archetype and team filters, and sorting by assigned fit or closest call.
