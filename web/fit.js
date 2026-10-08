const fitData = window.PLAYER_CLUSTER_FIT;
const table = document.getElementById("fit-table");
const search = document.getElementById("player-search");
const sort = document.getElementById("player-sort");
const archetypeFilter = document.getElementById("archetype-filter");
const teamFilter = document.getElementById("team-filter");
const count = document.getElementById("result-count");
const poolNote = document.getElementById("pool-note");
let tier = "role";

const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"})[char]);
const labelsFor = value => value === "high" ? fitData.highLabels : fitData.roleLabels;
const scoreFor = player => player.scores[labelsFor(player.tier).indexOf(player.assigned)];
const gapFor = player => {
  const ordered = [...player.scores].sort((a, b) => b - a);
  return ordered[0] - ordered[1];
};

function updateFilters() {
  archetypeFilter.innerHTML = `<option value="">All archetypes</option>${labelsFor(tier).map(label => `<option value="${escapeHtml(label)}">${escapeHtml(label)}</option>`).join("")}`;
  const teams = [...new Set(fitData.players.filter(player => player.tier === tier).flatMap(player => player.team.split("/")))].sort();
  const selectedTeam = teamFilter.value;
  teamFilter.innerHTML = `<option value="">All teams</option>${teams.map(team => `<option value="${escapeHtml(team)}">${escapeHtml(team)}</option>`).join("")}`;
  if (teams.includes(selectedTeam)) teamFilter.value = selectedTeam;
}

function render() {
  const labels = labelsFor(tier);
  const query = search.value.trim().toLocaleLowerCase();
  const players = fitData.players.filter(player => player.tier === tier
    && (!archetypeFilter.value || player.assigned === archetypeFilter.value)
    && (!teamFilter.value || player.team.split("/").includes(teamFilter.value))
    && (`${player.player} ${player.assigned} ${player.team}`).toLocaleLowerCase().includes(query));
  if (sort.value === "assigned-desc") players.sort((a, b) => scoreFor(b) - scoreFor(a) || a.player.localeCompare(b.player));
  else if (sort.value === "assigned-asc") players.sort((a, b) => scoreFor(a) - scoreFor(b) || a.player.localeCompare(b.player));
  else if (sort.value === "gap") players.sort((a, b) => gapFor(a) - gapFor(b) || a.player.localeCompare(b.player));
  else players.sort((a, b) => a.player.localeCompare(b.player));

  const assignedSort = sort.value.startsWith("assigned-");
  const sortMark = sort.value === "assigned-asc" ? "↑" : sort.value === "assigned-desc" ? "↓" : "↕";
  table.querySelector("thead").innerHTML = `<tr><th scope="col">PLAYER</th><th scope="col">POS</th><th scope="col">TEAM</th><th scope="col">ASSIGNED ARCHETYPE</th><th scope="col" aria-sort="${assignedSort ? sort.value === "assigned-asc" ? "ascending" : "descending" : "none"}"><button type="button" class="sort-heading" data-sort-assigned aria-label="Sort by assigned fit percentage">ASSIGNED FIT ${sortMark}</button></th>${labels.map(label => `<th scope="col">${escapeHtml(label)}</th>`).join("")}</tr>`;
  table.querySelector("tbody").innerHTML = players.map(player => {
    const assignedFit = scoreFor(player);
    const cells = player.scores.map((score, index) => `<td class="score-cell ${labels[index] === player.assigned ? "is-assigned" : ""}"><span>${score.toFixed(1)}%</span><i style="--fill:${score}%" aria-hidden="true"></i></td>`).join("");
    return `<tr><th scope="row">${escapeHtml(player.player)}</th><td>${escapeHtml(player.position)}</td><td>${escapeHtml(player.team)}</td><td class="assigned-name">${escapeHtml(player.assigned)}</td><td class="assigned-fit">${assignedFit.toFixed(1)}%</td>${cells}</tr>`;
  }).join("");
  count.textContent = `${players.length} of ${fitData.players.filter(player => player.tier === tier).length} ${tier === "high" ? "high-usage" : "role"} players shown`;
  poolNote.textContent = tier === "high"
    ? "All high-usage players enter the same two-cluster model. Playmaking uses assists per 36 and assist-to-turnover ratio, not raw turnover volume. The assigned group is the closest centroid before rounding."
    : "All five role-player percentages come from the same K-means model. The assigned group is the closest centroid before rounding.";
  poolNote.textContent += " Players listed with multiple teams appear under each of those teams in the team filter.";
}

document.querySelectorAll("[data-tier]").forEach(button => button.addEventListener("click", () => {
  tier = button.dataset.tier;
  document.querySelectorAll("[data-tier]").forEach(item => item.setAttribute("aria-pressed", String(item === button)));
  updateFilters();
  render();
}));
search.addEventListener("input", render);
archetypeFilter.addEventListener("change", render);
teamFilter.addEventListener("change", render);
sort.addEventListener("change", render);
table.addEventListener("click", event => {
  if (!event.target.closest("[data-sort-assigned]")) return;
  sort.value = sort.value === "assigned-desc" ? "assigned-asc" : "assigned-desc";
  render();
});
updateFilters();
render();
