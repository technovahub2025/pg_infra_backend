const Client = require('../models/Client');
const Project = require('../models/Project');

function escapeRegex(value = '') {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function findClientByName(clientName) {
  const name = String(clientName || '').trim();
  if (!name) return null;
  return Client.findOne({ clientName: { $regex: `^${escapeRegex(name)}$`, $options: 'i' } });
}

async function upsertClientProjectLink(project) {
  if (!project?.clientName) return null;

  const projectId = String(project._id || project.id || '');
  if (!projectId) return null;

  const clientName = String(project.clientName || '').trim();
  if (!clientName) return null;

  let client = await findClientByName(clientName);
  if (!client) {
    client = await Client.create({
      clientName,
      companyName: clientName,
      segment: project.companySegment || '',
      projectIds: [projectId],
      status: 'Active',
    });
    return client;
  }

  client.clientName = client.clientName || clientName;
  client.companyName = client.companyName || clientName;
  if (!client.segment && project.companySegment) {
    client.segment = project.companySegment;
  }
  client.projectIds = Array.from(new Set([...(client.projectIds || []).map(String), projectId])).filter(Boolean);
  await client.save();
  return client;
}

async function removeProjectFromClient(projectId, clientName) {
  if (!projectId) return null;
  const client = clientName ? await findClientByName(clientName) : await Client.findOne({ projectIds: projectId });
  if (!client) return null;

  client.projectIds = (client.projectIds || []).filter((item) => String(item) !== String(projectId));
  await client.save();
  return client;
}

async function syncClientsFromProjects() {
  const projects = await Project.find().select('_id clientName companySegment');
  const seen = new Map();

  for (const project of projects) {
    const key = String(project.clientName || '').trim().toLowerCase();
    if (!key) continue;

    if (!seen.has(key)) {
      seen.set(key, []);
    }
    seen.get(key).push(project);
  }

  for (const projectGroup of seen.values()) {
    const [firstProject] = projectGroup;
    const client = await upsertClientProjectLink(firstProject);
    if (client) {
      const projectIds = projectGroup.map((project) => String(project._id));
      client.projectIds = Array.from(new Set([...(client.projectIds || []).map(String), ...projectIds]));
      await client.save();
    }
  }
}

module.exports = {
  upsertClientProjectLink,
  removeProjectFromClient,
  syncClientsFromProjects,
  findClientByName,
};
