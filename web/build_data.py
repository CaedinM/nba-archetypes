"""Build the atlas leaderboards from the current, complete model assignments."""

from __future__ import annotations

import json
import re
import unicodedata
from pathlib import Path

import pandas as pd


ROOT = Path(__file__).resolve().parents[1]
ASSIGNMENTS = ROOT / "data/processed/current_player_archetypes.csv"
LEBRON = ROOT / "data/raw/nba_2025_26_lebron.csv"
LEBRON_JSON = ROOT / "data/raw/nba_2025_26_lebron.json"
ORDER = ["Primary Playmakers", "Primary Scorers", "3-and-D Contributors", "Rim-Runners", "Secondary Facilitators", "Secondary Scorers", "Spot-Up Shooters"]
HIGH_ORDER = ORDER[:2]
ROLE_ORDER = ORDER[2:]


def key(value: str) -> str:
    ascii_name = unicodedata.normalize("NFKD", value).encode("ascii", "ignore").decode()
    name = re.sub(r"[^a-z0-9]", "", ascii_name.lower())
    return re.sub(r"(iii|ii|jr)$", "", name)


def main() -> None:
    assignments = pd.read_csv(ASSIGNMENTS)
    lebron = pd.read_csv(LEBRON)
    profiles = json.loads(LEBRON_JSON.read_text())["players"]
    info = {key(player["full_nm"]): player for player in profiles}
    lebron["key"] = lebron.Player.map(key)
    assignments["key"] = assignments.Player.map(key).replace({"ronholland": "ronaldholland"})
    assert lebron.key.is_unique and assignments.key.is_unique
    joined = assignments.merge(lebron[["key", "lebron", "o_lebron", "d_lebron", "lebron_war"]], on="key", how="left", validate="one_to_one")
    assert joined.lebron.notna().all(), "Every classified player needs a LEBRON match"
    fit = pd.read_csv(ROOT / "data/processed/player_cluster_fit.csv")
    assert len(fit) == len(assignments) == 389 and fit.Player.is_unique

    archetypes = []
    for label in ORDER:
        members = joined.loc[joined.archetype.eq(label)]
        group = members.sort_values(["lebron", "lebron_war"], ascending=False).head(10)
        players = []
        for row in group.itertuples():
            player = info[row.key]
            nba_id = player.get("nba_id")
            players.append({"name": row.Player, "team": player["team_name"], "nbaId": int(nba_id) if nba_id is not None else None, "lebron": round(row.lebron, 2), "offense": round(row.o_lebron, 2), "defense": round(row.d_lebron, 2)})
        representative_rows = fit.loc[fit.archetype.eq(label)].sort_values(["assigned_fit_pct", "Player"], ascending=[False, True]).head(3)
        assert len(representative_rows) == 3
        representatives = []
        for row in representative_rows.itertuples():
            player_key = key(row.Player)
            if player_key == "ronholland":
                player_key = "ronaldholland"
            nba_id = info[player_key].get("nba_id")
            representatives.append({"name": row.Player, "fit": round(row.assigned_fit_pct, 2), "nbaId": int(nba_id) if nba_id is not None else None})
        archetypes.append({"label": label, "count": len(members), "medianLebron": round(float(members.lebron.median()), 2), "players": players, "representatives": representatives})
    assert len(archetypes) == 7 and sum(len(item["players"]) for item in archetypes) == 70
    (ROOT / "web/data.js").write_text("window.ARCHETYPE_RANKINGS = " + json.dumps(archetypes, ensure_ascii=False, indent=2) + ";\n")
    records = []
    for _, row in fit.iterrows():
        labels = HIGH_ORDER if row["tier"] == "high" else ROLE_ORDER
        scores = [round(float(row[label]), 2) for label in labels]
        player_key = key(row["Player"])
        if player_key == "ronholland":
            player_key = "ronaldholland"
        assert player_key in info, f"Missing team for {row['Player']}"
        records.append({"player": row["Player"], "position": row["listed_position"], "team": info[player_key]["team_name"], "tier": row["tier"], "assigned": row["archetype"], "scores": scores})
    fit_payload = {"highLabels": HIGH_ORDER, "roleLabels": ROLE_ORDER, "players": records}
    (ROOT / "web/fit-data.js").write_text("window.PLAYER_CLUSTER_FIT = " + json.dumps(fit_payload, ensure_ascii=False, separators=(",", ":")) + ";\n")
    print("Wrote web/data.js and web/fit-data.js from current assignments")


if __name__ == "__main__":
    main()
