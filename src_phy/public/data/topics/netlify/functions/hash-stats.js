import crypto from "crypto";

const computeHash = (stats, secret) => {
  const combined = Object.values(stats).join('') + secret;
  return crypto.createHash('sha256').update(combined).digest('hex');
};

export async function handler(event, context) {
  try {
    const body = JSON.parse(event.body);
    const stats = body.stats;

    const hash = computeHash(stats, process.env.ACHIEVEMENTS_SECRET);

    return {
      statusCode: 200,
      body: JSON.stringify({ hash })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
}