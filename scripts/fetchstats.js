import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const USERNAME = '4kromm'; 

const query = `
query($login: String!) {
  user(login: $login) {
    contributionsCollection {
      totalCommitContributions
      contributionCalendar {
        totalContributions
      }
    }
    repositories(first: 100, ownerAffiliations: OWNER, privacy: PUBLIC) {
      totalCount
      nodes {
        stargazerCount
      }
    }
    pullRequests(states: [OPEN, MERGED, CLOSED]) {
      totalCount
    }
    issues(states: [OPEN, CLOSED]) {
      totalCount
    }
  }
}`;

async function main() {
  const token = process.env.GH_TOKEN;
  if (!token) {
    console.error('GH_TOKEN tidak ditemukan di environment variable');
    process.exit(1);
  }

  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ query, variables: { login: USERNAME } })
  });

  const json = await res.json();

  if (json.errors) {
    console.error('GraphQL error:', JSON.stringify(json.errors, null, 2));
    process.exit(1);
  }

  const user = json.data.user;
  const totalStars = user.repositories.nodes.reduce(
    (sum, repo) => sum + repo.stargazerCount,
    0
  );

  const stats = {
    totalContributions: user.contributionsCollection.contributionCalendar.totalContributions,
    totalCommits: user.contributionsCollection.totalCommitContributions,
    totalStars: totalStars,
    totalRepos: user.repositories.totalCount,
    totalPRs: user.pullRequests.totalCount,
    totalIssues: user.issues.totalCount,
    updatedAt: new Date().toISOString()
  };

  const outDir = path.join(__dirname, '..', 'public', 'data');
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(
    path.join(outDir, 'github-stats.json'),
    JSON.stringify(stats, null, 2)
  );

  console.log('Berhasil update github-stats.json:', stats);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

  