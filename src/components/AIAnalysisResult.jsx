import React, { useState, useEffect } from 'react';

function AIAnalysisResult({ analysis, timestamp }) {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(true);

  // Parse the AI analysis text into conversational format
  const parseAnalysis = (text) => {
    const sections = [];
    const lines = text.split('\n');
    let currentSection = null;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Check for section headers
      if (line.startsWith('**') && line.endsWith('**')) {
        // Save previous section
        if (currentSection) {
          sections.push(currentSection);
        }
        
        // Start new section
        const title = line.replace(/\*\*/g, '').trim();
        currentSection = {
          title,
          content: [],
          type: getSectionType(title)
        };
      } else if (line && currentSection) {
        // Add content to current section with enhanced formatting
        currentSection.content.push(enhanceTextFormatting(line));
      }
    }
    
    // Add the last section
    if (currentSection) {
      sections.push(currentSection);
    }
    
    return sections;
  };

  // Convert structured analysis to conversational format
  const convertToConversational = (sections) => {
    const messages = [];
    
    // Add greeting message
    messages.push({
      type: 'ai',
      content: "I've analyzed your symptoms and here's what I found:",
      isGreeting: true
    });

    sections.forEach(section => {
      if (section.type === 'conditions') {
        messages.push({
          type: 'ai',
          content: `**Possible Conditions:**\n\n${section.content.join('\n')}`,
          icon: '🩺',
          color: 'blue'
        });
      } else if (section.type === 'urgency') {
        const urgencyLevel = section.content.join(' ').toLowerCase();
        let urgencyColor = 'green';
        let urgencyIcon = '✅';
        
        if (urgencyLevel.includes('high') || urgencyLevel.includes('urgent') || urgencyLevel.includes('emergency')) {
          urgencyColor = 'red';
          urgencyIcon = '🚨';
        } else if (urgencyLevel.includes('medium') || urgencyLevel.includes('moderate')) {
          urgencyColor = 'yellow';
          urgencyIcon = '⚠️';
        }
        
        messages.push({
          type: 'ai',
          content: `**Urgency Level:**\n\n${section.content.join('\n')}`,
          icon: urgencyIcon,
          color: urgencyColor
        });
      } else if (section.type === 'actions') {
        messages.push({
          type: 'ai',
          content: `**Recommended Actions:**\n\n${section.content.join('\n')}`,
          icon: '📋',
          color: 'green'
        });
      } else if (section.type === 'emergency') {
        messages.push({
          type: 'ai',
          content: `**When to Seek Immediate Care:**\n\n${section.content.join('\n')}`,
          icon: '🚨',
          color: 'red'
        });
      } else if (section.type === 'advice') {
        messages.push({
          type: 'ai',
          content: `**General Health Advice:**\n\n${section.content.join('\n')}`,
          icon: '💡',
          color: 'purple'
        });
      }
    });

    // Add disclaimer message
    messages.push({
      type: 'ai',
      content: "**Important:** This is preliminary guidance only. Please consult with a qualified healthcare professional for proper diagnosis and treatment.",
      icon: '⚠️',
      color: 'amber',
      isDisclaimer: true
    });

    return messages;
  };

  const enhanceTextFormatting = (text) => {
    // Make bold text more prominent
    let enhancedText = text
      // Bold text formatting
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-gray-900">$1</strong>')
      // Italic text formatting
      .replace(/\*(.*?)\*/g, '<em class="italic text-gray-700">$1</em>')
      // Highlight severity levels
      .replace(/\b(High|HIGH|Urgent|URGENT|Emergency|EMERGENCY|Critical|CRITICAL)\b/g, '<span class="font-bold text-red-600 bg-red-50 px-1 rounded">$1</span>')
      .replace(/\b(Medium|MEDIUM|Moderate|MODERATE)\b/g, '<span class="font-bold text-yellow-600 bg-yellow-50 px-1 rounded">$1</span>')
      .replace(/\b(Low|LOW|Mild|MILD|Minor|MINOR)\b/g, '<span class="font-bold text-green-600 bg-green-50 px-1 rounded">$1</span>')
      // Highlight important medical terms
      .replace(/\b(immediately|urgent|emergency|severe|critical|dangerous|life-threatening)\b/gi, '<span class="font-bold text-red-700">$1</span>')
      .replace(/\b(consult|doctor|physician|healthcare|medical|hospital|clinic)\b/gi, '<span class="font-semibold text-blue-700">$1</span>')
      .replace(/\b(medication|medicine|drug|prescription|treatment|therapy)\b/gi, '<span class="font-semibold text-purple-700">$1</span>')
      // Highlight numbers and percentages
      .replace(/\b(\d+%|\d+\.\d+%|\d+\/\d+)\b/g, '<span class="font-bold text-indigo-600">$1</span>')
      // Highlight time references
      .replace(/\b(\d+\s*(hours?|days?|weeks?|months?|years?))\b/gi, '<span class="font-semibold text-orange-600">$1</span>')
      // Highlight symptoms and conditions
      .replace(/\b(fever|pain|ache|swelling|rash|nausea|vomiting|diarrhea|headache|dizziness|fatigue|cough|sore throat|shortness of breath)\b/gi, '<span class="font-semibold text-gray-800 bg-gray-100 px-1 rounded">$1</span>')
      // Highlight important action words
      .replace(/\b(avoid|stop|continue|increase|decrease|monitor|check|measure|rest|exercise|drink|eat|take)\b/gi, '<span class="font-semibold text-green-700">$1</span>');
    
    return enhancedText;
  };

  const getSectionType = (title) => {
    const titleLower = title.toLowerCase();
    if (titleLower.includes('possible conditions') || titleLower.includes('condition')) {
      return 'conditions';
    } else if (titleLower.includes('urgency') || titleLower.includes('level')) {
      return 'urgency';
    } else if (titleLower.includes('recommended') || titleLower.includes('action')) {
      return 'actions';
    } else if (titleLower.includes('immediate') || titleLower.includes('emergency')) {
      return 'emergency';
    } else if (titleLower.includes('general') || titleLower.includes('advice')) {
      return 'advice';
    } else if (titleLower.includes('disclaimer') || titleLower.includes('important')) {
      return 'disclaimer';
    }
    return 'default';
  };

  const getSectionIcon = (type) => {
    switch (type) {
      case 'conditions': return '🩺';
      case 'urgency': return '⚠️';
      case 'actions': return '📋';
      case 'emergency': return '🚨';
      case 'advice': return '💡';
      case 'disclaimer': return 'ℹ️';
      default: return '📄';
    }
  };

  const getSectionColor = (type) => {
    switch (type) {
      case 'conditions': return 'blue';
      case 'urgency': return 'yellow';
      case 'actions': return 'green';
      case 'emergency': return 'red';
      case 'advice': return 'purple';
      case 'disclaimer': return 'gray';
      default: return 'blue';
    }
  };

  const getUrgencyColor = (content) => {
    const text = content.join(' ').toLowerCase();
    if (text.includes('high') || text.includes('urgent') || text.includes('emergency')) {
      return 'red';
    } else if (text.includes('medium') || text.includes('moderate')) {
      return 'yellow';
    } else if (text.includes('low') || text.includes('mild')) {
      return 'green';
    }
    return 'blue';
  };

  // Initialize messages with typing animation
  useEffect(() => {
    const sections = parseAnalysis(analysis);
    const chatMessages = convertToConversational(sections);
    
    // Simulate typing animation
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex < chatMessages.length) {
        setMessages(prev => [...prev, chatMessages[currentIndex]]);
        currentIndex++;
      } else {
        setIsTyping(false);
        clearInterval(typingInterval);
      }
    }, 800);

    return () => clearInterval(typingInterval);
  }, [analysis]);

  return (
    <div className="space-y-4">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 grid place-items-center text-lg">
            🤖
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">AI Health Assistant</h3>
            <p className="text-sm text-gray-600">Analyzing your symptoms...</p>
          </div>
        </div>
        <div className="text-xs text-gray-500 bg-white px-2 py-1 rounded">
          {new Date(timestamp).toLocaleString()}
        </div>
      </div>

      {/* Chat Messages */}
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {messages.map((message, index) => (
          <div key={index} className="flex items-start gap-3">
            {/* AI Avatar */}
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 grid place-items-center text-sm flex-shrink-0">
              {message.icon || '🤖'}
            </div>
            
            {/* Message Content */}
            <div className={`flex-1 rounded-lg p-3 ${
              message.isGreeting ? 'bg-blue-50 border border-blue-200' :
              message.isDisclaimer ? 'bg-amber-50 border border-amber-200' :
              message.color === 'red' ? 'bg-red-50 border border-red-200' :
              message.color === 'yellow' ? 'bg-yellow-50 border border-yellow-200' :
              message.color === 'green' ? 'bg-green-50 border border-green-200' :
              message.color === 'purple' ? 'bg-purple-50 border border-purple-200' :
              'bg-gray-50 border border-gray-200'
            }`}>
              <div 
                className={`text-sm leading-relaxed ${
                  message.isGreeting ? 'text-blue-800' :
                  message.isDisclaimer ? 'text-amber-800' :
                  message.color === 'red' ? 'text-red-800' :
                  message.color === 'yellow' ? 'text-yellow-800' :
                  message.color === 'green' ? 'text-green-800' :
                  message.color === 'purple' ? 'text-purple-800' :
                  'text-gray-800'
                }`}
                dangerouslySetInnerHTML={{ 
                  __html: enhanceTextFormatting(message.content) 
                }}
              />
            </div>
          </div>
        ))}
        
        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 grid place-items-center text-sm flex-shrink-0">
              🤖
            </div>
            <div className="flex-1 rounded-lg p-3 bg-gray-50 border border-gray-200">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <span className="text-sm text-gray-500 ml-2">AI is thinking...</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AIAnalysisResult;
