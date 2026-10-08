const profiles = [
  {
    label: "Primary Playmakers", tier: "high", count: 26, number: "01", color: "#e5f65b", ink: "#172020",
    deck: "THE OFFENSE STARTS HERE",
    short: "High-volume creators who decide where the next advantage appears.",
    description: "These high-usage engines generate shots for teammates while carrying a featured scoring load. They average more assists and potential assists, and a higher assist-to-turnover ratio, than primary scorers.",
    traits: ["High usage", "Assists & potential assists", "Assist-to-turnover ratio"],
    provides: "They organize possessions, force defensive rotations, and turn teammates into finishers.",
    uniqueMembers: [{name: "Tyrese Maxey", description: "He takes 20.31 shots per 36, more than the Primary Scorers' 18.53 average. Yet his 6.24 assists per 36 and 2.70 assists per turnover exceed that group's 4.02 and 1.49, giving this scoring guard a playmaker's statistical profile."}],
    outlier: {name: "Giannis Antetokounmpo", description: "He takes 61% of his shots at the rim versus 20% for this cluster and draws far more free throws per shot. His interior scoring and rebounding make him its furthest member from the centroid."}
  },
  {
    label: "Primary Scorers", tier: "high", count: 39, number: "02", color: "#ff7049", ink: "#1d2020",
    deck: "SCORING FIRST",
    short: "Featured scorers whose statistical role leans less toward organizing teammates' shots.",
    description: "This broad high-usage cluster includes guards, wings, and bigs. Its members still create offense, but average fewer assists and potential assists and a lower assist-to-turnover ratio than the playmakers. Position does not determine membership.",
    traits: ["High usage", "Scoring load", "Lower passing creation"],
    provides: "They carry scoring possessions and pressure defenses in different ways, from perimeter shot making to interior finishing.",
    uniqueMembers: [{name: "Scoot Henderson", description: "A listed point guard lands with the scorers. His 25.0% usage puts him in the high-usage pool, but his 5.39 assists per 36 and 1.54 assists per turnover are below the playmakers' averages of 7.76 and 2.33."}],
    outlier: {name: "Zion Williamson", description: "He takes 58% of his shots at the rim versus 22% for this cluster, draws far more free throws, and almost never shoots threes. That shot mix puts him furthest from the scorer centroid."}
  },
  {
    label: "3-and-D Contributors", tier: "role", count: 63, number: "03", color: "#aac5ff", ink: "#18232d",
    deck: "SPACE AND STOPS",
    short: "Supporting players who pair perimeter attempts with defensive activity.",
    description: "This cluster takes 55% of its shots from three and 47% in catch-and-shoot situations on average. It also has the highest steals rate of the role-player groups and a positive average DBPM. Some members provide much more defense than shooting, so the label describes the center of the group rather than every player.",
    traits: ["Three-point share", "Catch-and-shoot chances", "Defensive activity"],
    provides: "They help space the floor while supplying ball pressure, rotations, and other defensive contributions.",
    uniqueMembers: [{name: "Gary Payton II", description: "Only 31% of his attempts are threes versus 55% for this cluster, and 45% come at the rim. His 2.11 steals per 36 and positive DBPM make defense the stronger part of his 3-and-D fit."}],
    outlier: {name: "Jaylin Williams", description: "His 9.19 defensive rebounds per 36 are more than double this cluster's 4.44, while his steals rate is lower. His rebounding and interior defensive profile make him the furthest member."}
  },
  {
    label: "Rim-Runners", tier: "role", count: 48, number: "04", color: "#ff9d98", ink: "#262020",
    deck: "VERTICAL PRESSURE",
    short: "Paint finishers who live above the rim and work the offensive glass.",
    description: "This role-player cluster leans into rim attempts, offensive boards, and blocks, with very little perimeter shooting. Their statistical footprint comes from close-range opportunities and physical activity.",
    traits: ["Rim attempts", "Offensive boards", "Blocks"],
    provides: "They turn passes into close-range finishes, create second chances, and contest shots inside.",
    uniqueMembers: [{name: "Chet Holmgren", description: "He takes 31% of his shots from three versus just 8% for this cluster, so he hardly looks like a traditional rim-runner. His 2.36 blocks and 8.74 defensive rebounds per 36 give him enough interior presence to land here."}],
    outlier: {name: "Ausar Thompson", description: "His 2.77 steals per 36 dwarf the cluster's 1.17, and he adds more assists than the typical rim-runner. His disruptive perimeter defense drives most of the distance."}
  },
  {
    label: "Secondary Facilitators", tier: "role", count: 60, number: "05", color: "#c1efaf", ink: "#1c2a20",
    deck: "THE NEXT PASS MATTERS",
    short: "Connectors who keep the offense moving after the first action.",
    description: "These role players stand out for assists, potential assists, and passing volume without carrying a primary scorer's usage. They can create advantages within a larger offensive system.",
    traits: ["Assists", "Potential assists", "Passing volume"],
    provides: "They connect creators to finishers, keep possessions alive, and make a team's offense less predictable.",
    uniqueMembers: [{name: "Kentavious Caldwell-Pope", description: "His 48% three-point attempt share suggests a 3-and-D role. Yet his 4.60 assists and 8.24 potential assists per 36 exceed that cluster's averages of 3.07 and 5.33, helping explain why the model groups him with facilitators."}],
    outlier: {name: "Isaiah Collier", description: "His 10.04 assists per 36 exceed even the Primary Playmakers' 7.76 average. But his 20.4% usage is below the 25% cutoff for that high-usage group, so he is clustered with role players; his unusually high creation then makes him stand out among Secondary Facilitators. His 12.22 shots per 36 are also well below the Primary Playmakers' 18.58 average."}
  },
  {
    label: "Secondary Scorers", tier: "role", count: 65, number: "06", color: "#f3cf87", ink: "#2b241b",
    deck: "MORE THAN A SPOT-UP THREAT",
    short: "Supporting scorers with the green light to find their own offense.",
    description: "This cluster has the highest field-goal volume and usage among role players, with less reliance on catch-and-shoot chances and less rebounding or defensive-activity specialization.",
    traits: ["Role-player shot volume", "Self-created offense", "Lower catch-and-shoot reliance"],
    provides: "They give a lineup another source of points and can absorb scoring possessions beyond the stars.",
    uniqueMembers: [{name: "Klay Thompson", description: "He takes 72% of his shots from three and 57% in catch-and-shoot situations, suggesting Spot-Up Shooters. His 17.51 shots per 36, though, far exceed that group's 11.58 average and put him with the higher-volume Secondary Scorers."}],
    outlier: {name: "Evan Mobley", description: "He blocks 1.96 shots per 36 versus the cluster's 0.62 and rebounds much more. His big-man defensive production makes him the furthest secondary scorer from the centroid."}
  },
  {
    label: "Spot-Up Shooters", tier: "role", count: 88, number: "07", color: "#b6ded8", ink: "#142421",
    deck: "SPACE IS A SKILL",
    short: "Off-ball threats whose shooting stretches the defense.",
    description: "A high share of three-point and catch-and-shoot attempts defines this large role-player group. Its average defensive indicators are lower than those of the 3-and-D contributors, while self-creation and rim pressure are limited.",
    traits: ["Three-point share", "Catch-and-shoot volume", "Off-ball role"],
    provides: "They stretch help defenders away from the paint and turn kick-outs into immediate shots.",
    uniqueMembers: [{name: "Cameron Johnson", description: "His 54% three-point share and 46% catch-and-shoot share look like a 3-and-D profile. But his 0.87 steals per 36 and −0.9 DBPM sit well below that cluster's averages of 1.64 and +1.0, so the model groups him with Spot-Up Shooters."}],
    outlier: {name: "Jay Huff", description: "He blocks 3.20 shots per 36 versus the cluster's 0.59, by far the largest source of his distance. He also takes more catch-and-shoot shots than the typical spot-up shooter."}
  }
];

const dataByLabel = new Map(window.ARCHETYPE_RANKINGS.map(item => [item.label, item]));
for (const profile of profiles) {
  const data = dataByLabel.get(profile.label);
  const representatives = data?.representatives;
  if (representatives?.length !== 3) throw new Error(`Missing representative players for ${profile.label}`);
  if (data.count !== profile.count || !Number.isFinite(data.medianLebron)) throw new Error(`Missing archetype summary for ${profile.label}`);
  profile.medianLebron = data.medianLebron;
  profile.visual = representatives.map(player => player.name);
}
const allPlayers = new Map(window.ARCHETYPE_RANKINGS.flatMap(item => [...item.players, ...item.representatives].map(player => [player.name, player])));
const grid = document.getElementById("card-grid");
const overlay = document.getElementById("overlay");
const drawer = document.getElementById("drawer");
const drawerContent = document.getElementById("drawer-content");
let lastFocused = null;

const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"})[char]);
const signed = value => `${value >= 0 ? "+" : ""}${value.toFixed(2)}`;
const initials = name => name.split(/\s+/).map(part => part[0]).slice(-2).join("").toUpperCase();
const portrait = (name, className = "") => {
  const player = allPlayers.get(name);
  const url = player?.nbaId ? `https://cdn.nba.com/headshots/nba/latest/1040x760/${player.nbaId}.png` : "";
  return `<span class="portrait ${className}"><span class="portrait-fallback" aria-hidden="true">${escapeHtml(initials(name))}</span>${url ? `<img src="${url}" alt="${escapeHtml(name)}" loading="lazy">` : ""}</span>`;
};

function cardMarkup(profile) {
  const slug = profile.number;
  return `<button type="button" class="archetype-card" data-profile="${slug}" data-tier="${profile.tier}" style="--card-color:${profile.color};--card-ink:${profile.ink}" aria-label="Explore ${escapeHtml(profile.label)}">
    <span class="card-top"><span>ARCHETYPE / ${profile.number}</span><span>${profile.count} PLAYERS</span></span>
    <span class="card-visual"><span class="card-halo"></span><span class="card-background-number">${profile.number}</span>${profile.visual.map((name, i) => portrait(name, `card-portrait card-portrait-${i + 1}`)).join("")}</span>
    <span class="card-text"><span class="card-deck">${profile.deck}</span><span class="card-title">${escapeHtml(profile.label)}</span><span class="card-stats"><span class="card-stat"><strong>${signed(profile.medianLebron)}</strong><span>MEDIAN LEBRON</span></span><span class="card-stat card-stat-count"><strong>${profile.count}</strong><span>PLAYERS IN CLUSTER</span></span></span><span class="card-bottom"><span>${profile.visual.map(name => escapeHtml(name)).join(" / ")}</span><span class="card-arrow" aria-hidden="true">↗</span></span></span>
  </button>`;
}

grid.innerHTML = profiles.map(cardMarkup).join("");

function rankingMarkup(profile) {
  const players = dataByLabel.get(profile.label)?.players || [];
  return `<div class="ranking" id="ranking" hidden>
    <div class="ranking-heading"><div><span class="detail-kicker">THE LEADERBOARD / LEBRON</span><h3 id="ranking-title" tabindex="-1">TOP ${players.length} IN THIS ROLE.</h3></div><span class="ranking-mark">${profile.number} / 07</span></div>
    ${players.length < 10 ? `<p class="ranking-note">Only ${players.length} players qualified for this archetype, so every member is shown.</p>` : ""}
    <div class="ranking-table-wrap"><table class="ranking-table"><thead><tr><th scope="col">RANK</th><th scope="col">PLAYER</th><th scope="col">TEAM</th><th scope="col">LEBRON</th><th scope="col">OFF</th><th scope="col">DEF</th></tr></thead><tbody>
      ${players.map((player, i) => `<tr><td class="rank-index">${String(i + 1).padStart(2, "0")}</td><td class="rank-player">${escapeHtml(player.name)}</td><td>${escapeHtml(player.team)}</td><td class="rank-score"><span>${signed(player.lebron)}</span><i style="--bar:${Math.max(0, Math.min(100, (player.lebron / 8) * 100))}%"></i></td><td>${signed(player.offense)}</td><td>${signed(player.defense)}</td></tr>`).join("")}
    </tbody></table></div><p class="ranking-footnote">LEBRON is an impact estimate pulled from Basketball Index. OFF and DEF show its offensive and defensive components. Values rounded to two decimals.</p>
  </div>`;
}

function uniqueMembersMarkup(profile) {
  if (!profile.uniqueMembers?.length) return "";
  return `<section class="unique-members" aria-label="Surprise member">
    <span class="detail-section-label">SURPRISE MEMBER / WHY HE FITS</span>
    <div class="unique-member-list">${profile.uniqueMembers.map((member, index) => `<article class="unique-member">
      <span class="unique-member-index" aria-hidden="true">${String(index + 1).padStart(2, "0")}</span>
      <div><h3>Surprise Member: ${escapeHtml(member.name)}</h3><p>${escapeHtml(member.description)}</p></div>
    </article>`).join("")}</div>
  </section>`;
}

function outlierMarkup(profile) {
  if (!profile.outlier) return "";
  return `<section class="outlier" aria-label="Biggest outlier">
    <span class="detail-section-label">FURTHEST FROM THE CLUSTER CENTER</span>
    <h3>Biggest Outlier: ${escapeHtml(profile.outlier.name)}</h3>
    <p>${escapeHtml(profile.outlier.description)}</p>
  </section>`;
}

function representativesMarkup(profile) {
  const representatives = dataByLabel.get(profile.label)?.representatives || [];
  return `<section class="representatives" aria-labelledby="representatives-title">
    <h3 class="representative-heading" id="representatives-title">MOST REPRESENTATIVE <span>/ BY ASSIGNED FIT</span></h3>
    <ol class="representative-list">${representatives.map((member, index) => `<li><span class="representative-rank">${String(index + 1).padStart(2, "0")}</span><span class="representative-name">${escapeHtml(member.name)}</span><strong>${member.fit.toFixed(1)}%</strong></li>`).join("")}</ol>
    <p>Relative fit to this archetype, not the probability that its label is correct.</p>
  </section>`;
}

function openProfile(profile) {
  lastFocused = document.activeElement;
  overlay.hidden = false;
  document.body.classList.add("drawer-open");
  drawer.style.setProperty("--detail-color", profile.color);
  drawer.style.setProperty("--detail-ink", profile.ink);
  const ranked = dataByLabel.get(profile.label)?.players || [];
  drawerContent.innerHTML = `<div class="detail-hero">
    <div class="detail-hero-header"><span>PROFILE ${profile.number} / 07</span><span>${profile.tier === "high" ? "HIGH-USAGE PLAYER" : "ROLE PLAYER"}</span></div>
    <div class="detail-art"><span class="detail-art-number">${profile.number}</span>${profile.visual.map((name, i) => portrait(name, `detail-portrait detail-portrait-${i + 1}`)).join("")}</div>
    <div class="detail-title-block"><span class="detail-kicker">${profile.deck}</span><h2 id="drawer-title">${escapeHtml(profile.label)}</h2><div class="detail-stats"><span class="detail-stat"><strong>${signed(profile.medianLebron)}</strong><span>MEDIAN LEBRON</span></span><span class="detail-stat"><strong>${profile.count}</strong><span>PLAYERS IN CLUSTER</span></span></div></div>
  </div>
  <div class="detail-body">
    <div class="detail-lead"><span class="detail-section-label">01 / THE ROLE</span><p>${escapeHtml(profile.short)}</p></div>
    <div class="detail-description"><div><span class="detail-section-label">THE STATISTICAL PROFILE</span><p>${escapeHtml(profile.description)}</p></div><div><span class="detail-section-label">WHAT THEY PROVIDE</span><p>${escapeHtml(profile.provides)}</p></div></div>
    <div class="trait-list" aria-label="Defining attributes">${profile.traits.map(trait => `<span>${escapeHtml(trait)}</span>`).join("")}</div>
    ${representativesMarkup(profile)}
    ${uniqueMembersMarkup(profile)}
    ${outlierMarkup(profile)}
    <button type="button" class="reveal-button" id="reveal-ranking" aria-expanded="false" aria-controls="ranking"><span>REVEAL ${ranked.length === 10 ? "TOP 10" : `ALL ${ranked.length}`} BY LEBRON</span><span aria-hidden="true">↘</span></button>
    ${rankingMarkup(profile)}
  </div>`;
  drawer.scrollTop = 0;
  document.getElementById("close-drawer").focus();
}

function closeProfile() {
  if (overlay.hidden) return;
  overlay.hidden = true;
  document.body.classList.remove("drawer-open");
  lastFocused?.focus();
}

grid.addEventListener("click", event => {
  const card = event.target.closest("[data-profile]");
  if (card) openProfile(profiles.find(profile => profile.number === card.dataset.profile));
});

document.querySelectorAll("[data-close]").forEach(element => element.addEventListener("click", closeProfile));
document.getElementById("close-drawer").addEventListener("click", closeProfile);
drawerContent.addEventListener("click", event => {
  const button = event.target.closest("#reveal-ranking");
  if (!button) return;
  const ranking = document.getElementById("ranking");
  ranking.hidden = false;
  button.setAttribute("aria-expanded", "true");
  button.hidden = true;
  ranking.scrollIntoView({behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "start"});
  document.getElementById("ranking-title").focus({preventScroll: true});
});

document.addEventListener("keydown", event => {
  if (overlay.hidden) return;
  if (event.key === "Escape") closeProfile();
  if (event.key !== "Tab") return;
  const focusable = [...drawer.querySelectorAll("button:not([hidden]), a[href], [tabindex]:not([tabindex='-1'])")].filter(el => !el.closest("[hidden]"));
  const first = focusable[0], last = focusable[focusable.length - 1];
  if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
  else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
});

document.querySelectorAll(".filter").forEach(button => button.addEventListener("click", () => {
  const filter = button.dataset.filter;
  document.querySelectorAll(".filter").forEach(item => {
    const active = item === button;
    item.classList.toggle("is-active", active);
    item.setAttribute("aria-pressed", String(active));
  });
  grid.querySelectorAll(".archetype-card").forEach(card => { card.hidden = filter !== "all" && card.dataset.tier !== filter; });
}));

document.addEventListener("error", event => {
  if (event.target.tagName === "IMG") event.target.classList.add("image-error");
}, true);
