import React from 'react';

const Experience = () => {
  const experiences = [
    {
      id: 1,
      role: 'Customer Success Specialist',
      company: 'Rigel OS',
      period: '2024 - Present',
      achievements: [
        {
          metric: '100+',
          label: 'Clients Trained',
          description: 'Leading to significant increase in platform usage and smoother onboarding for pharmaceutical staff'
        },
        {
          metric: '90%+',
          label: 'Resolution Rate',
          description: 'Customer support queries resolved within 24 hours, contributing to strong client satisfaction'
        },
        {
          metric: '24hrs',
          label: 'Response Time',
          description: 'Average time to resolve customer queries, ensuring rapid support delivery'
        }
      ]
    },
    {
      id: 2,
      role: 'Technical Support Engineer',
      company: 'Rigel OS',
      period: '2024 - Present',
      achievements: [
        {
          metric: '50+',
          label: 'Clients Educated',
          description: 'Improving user adoption and digital literacy in pharmaceutical operations'
        },
        {
          metric: '90%+',
          label: 'First Response Resolution',
          description: 'Queries resolved within the first response, enhancing client satisfaction and retention'
        },
        {
          metric: '30+',
          label: 'Client Demos',
          description: 'Promoting digital solutions aligned with regulatory standards, boosting product engagement'
        }
      ]
    }
  ];

  return (
    <section id="experience" className="section experience-section">
      <div className="section-container">
        <h2 className="section-title">
          Professional <span>Experience</span>
        </h2>
        <p style={{ textAlign: 'center', color: '#a9adb8', fontSize: '1.05rem', marginBottom: '56px', maxWidth: '700px', margin: '0 auto 56px' }}>
          Proven track record in technical support and customer success within the pharmaceutical tech industry.
        </p>

        <div className="experience-timeline">
          {experiences.map((exp, index) => (
            <div key={exp.id} className="experience-item" data-index={index}>
              <div className="experience-marker">
                <div className="marker-dot"></div>
                <div className="marker-line"></div>
              </div>
              
              <div className="experience-card">
                <div className="experience-header">
                  <div className="experience-title-group">
                    <h3 className="experience-role">{exp.role}</h3>
                    <div className="experience-meta">
                      <span className="experience-company">{exp.company}</span>
                      <span className="experience-period">{exp.period}</span>
                    </div>
                  </div>
                </div>

                <div className="experience-metrics">
                  {exp.achievements.map((achievement, idx) => (
                    <div key={idx} className="metric-card">
                      <div className="metric-value">{achievement.metric}</div>
                      <div className="metric-label">{achievement.label}</div>
                      <p className="metric-description">{achievement.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
