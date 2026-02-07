import React from 'react';

const Certificates = () => {
  const documents = [
    {
      id: 1,
      title: 'Professional Foundations Certificate',
      issuer: 'ALX Africa',
      date: '2024',
      type: 'certificate',
      image: '/certificates/professional-foundations-certificate.jpg'
    },
    {
      id: 2,
      title: 'Backend Web Development Certificate',
      issuer: 'ALX Africa',
      date: '2025',
      type: 'certificate',
      image: '/certificates/backend-web-development-certificate.jpg'
    },
    {
      id: 3,
      title: 'Cybersecurity Certificate',
      issuer: 'ALX Africa',
      date: '2026',
      type: 'certificate',
      image: '/certificates/cybersecurity-certificate.jpg'
    },
    {
      id: 4,
      title: 'Professional Resume',
      issuer: 'Dominic Amuah',
      date: '2026',
      type: 'resume',
      file: '/documents/Dominic-Amuah-Resume.pdf'
    }
  ];

  const handleDownload = (imageUrl, title) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `${title}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleResumeDownload = (pdfUrl, title) => {
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = `${title}.pdf`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const certificates = documents.filter(doc => doc.type === 'certificate');
  const resume = documents.find(doc => doc.type === 'resume');

  return (
    <section id="certificates" className="section certificates-section">
      <div className="section-container">
        <h2 className="section-title">
          Certificates & <span>Resume</span>
        </h2>
        <p style={{ textAlign: 'center', color: '#a9adb8', fontSize: '1.05rem', marginBottom: '56px', maxWidth: '700px', margin: '0 auto 56px' }}>
          Professional certifications and qualifications that validate my technical expertise and commitment to continuous learning.
        </p>

        {/* Certificates Grid */}
        <div className="certificates-grid">
          {certificates.map((cert) => (
            <div key={cert.id} className="certificate-card">
              <div className="certificate-image">
                <img src={cert.image} alt={cert.title} />
                <div className="certificate-overlay">
                  <button 
                    onClick={() => handleDownload(cert.image, cert.title)}
                    className="download-btn"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    Download
                  </button>
                  <button 
                    onClick={() => window.open(cert.image, '_blank')}
                    className="view-btn"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                    View
                  </button>
                </div>
              </div>
              <div className="certificate-info">
                <h3 className="certificate-title">{cert.title}</h3>
                <div className="certificate-meta">
                  <span className="certificate-issuer">{cert.issuer}</span>
                  <span className="certificate-date">{cert.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Resume Section */}
        {resume && (
          <div className="resume-section">
            <div className="resume-card">
              <div className="resume-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
              </div>
              <div className="resume-content">
                <h3 className="resume-title">{resume.title}</h3>
                <p className="resume-description">
                  Download my complete professional resume including work experience, technical skills, and educational background.
                </p>
              </div>
              <button 
                onClick={() => handleResumeDownload(resume.file, resume.title)}
                className="resume-download-btn"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Download Resume
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Certificates;
