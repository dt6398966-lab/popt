const { Agent, User, Property } = require('../models');

exports.getAllAgents = async (req, res) => {
  try {
    const agents = await Agent.findAll({
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'name', 'email', 'phone']
      }],
      order: [['rating', 'DESC']]
    });

    res.render('agents/list', {
      title: 'Find Real Estate Agents - 99acres',
      agents
    });
  } catch (error) {
    console.error('Error fetching agents:', error);
    req.flash('error_msg', 'Error loading agents.');
    res.redirect('/');
  }
};

exports.getAgentById = async (req, res) => {
  try {
    const agent = await Agent.findByPk(req.params.id, {
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'name', 'email', 'phone']
      }]
    });

    if (!agent) {
      req.flash('error_msg', 'Agent not found.');
      return res.redirect('/agents');
    }

    // Get agent's properties
    const agentProperties = await Property.findAll({
      where: {
        user_id: agent.user_id,
        is_active: true
      },
      limit: 12,
      order: [['createdAt', 'DESC']]
    });

    res.render('agents/detail', {
      title: `${agent.user.name} - 99acres`,
      agent,
      agentProperties
    });
  } catch (error) {
    console.error('Error fetching agent:', error);
    req.flash('error_msg', 'Error loading agent details.');
    res.redirect('/agents');
  }
};

