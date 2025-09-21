// ===== ALL IS WELL - Mental Wellness App JavaScript =====
// Accessibility-first, crisis-aware interactive features

class AllIsWellApp {
    constructor() {
        this.init();
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeApp());
        } else {
            this.initializeApp();
        }
    }

    initializeApp() {
        console.log('Initializing ALL IS WELL app...');

        this.initNavigation();
        this.initHero();
        this.initBreathing();
        this.initAffirmations();
        this.initMotivationCarousel();
        this.initAssessment();
        this.initChat();
        this.initAccessibility();
        this.initURLParams();

        console.log('ALL IS WELL app initialized successfully');
    }

    // ===== NAVIGATION =====
    initNavigation() {
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');

        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
                navToggle.setAttribute('aria-expanded', !isExpanded);
                navMenu.classList.toggle('active');
            });

            const navLinks = document.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    navToggle.setAttribute('aria-expanded', 'false');
                    navMenu.classList.remove('active');
                });
            });

            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                    navToggle.setAttribute('aria-expanded', 'false');
                    navMenu.classList.remove('active');
                    navToggle.focus();
                }
            });
        }

        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // ===== HERO SECTION =====
    initHero() {
        this.startTypewriter();
    }

    startTypewriter() {
        const element = document.getElementById('affirmation-text');
        const text = "Everything is going to be fine my friend 🙂";
        let i = 0;

        if (!element) return;
        element.textContent = '';

        function typeWriter() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 80);
            }
        }
        setTimeout(typeWriter, 1500);
    }

    // ===== BREATHING EXERCISE =====
    initBreathing() {
        const breathingCircle = document.querySelector('.breathing-circle');
        const breathingInstructions = document.getElementById('breathing-instructions');
        const playBtn = document.querySelector('.breathing-play');
        const pauseBtn = document.querySelector('.breathing-pause');
        const triggers = document.querySelectorAll('.breathing-trigger');

        let isBreathing = false;
        let breathingInterval = null;
        let phase = 'inhale';
        let phaseTimer = 0;

        const phases = {
            inhale: { duration: 4, text: 'Breathe in...' },
            hold: { duration: 2, text: 'Hold...' },
            exhale: { duration: 6, text: 'Breathe out...' },
            pause: { duration: 2, text: 'Rest...' }
        };

        const startBreathing = () => {
            if (isBreathing) return;
            isBreathing = true;
            breathingCircle.classList.add('breathing');
            playBtn.style.display = 'none';
            pauseBtn.style.display = 'block';
            this.announceToScreenReader('Starting breathing exercise');

            breathingInterval = setInterval(() => {
                phaseTimer++;
                const currentPhase = phases[phase];
                if (phaseTimer >= currentPhase.duration) {
                    phaseTimer = 0;
                    switch (phase) {
                        case 'inhale': phase = 'hold'; break;
                        case 'hold': phase = 'exhale'; break;
                        case 'exhale': phase = 'pause'; break;
                        case 'pause': phase = 'inhale'; break;
                    }
                }
                const timeLeft = phases[phase].duration - phaseTimer;
                breathingInstructions.textContent = `${phases[phase].text} (${timeLeft}s)`;
            }, 1000);
        };

        const stopBreathing = () => {
            if (!isBreathing) return;
            isBreathing = false;
            breathingCircle.classList.remove('breathing');
            playBtn.style.display = 'block';
            pauseBtn.style.display = 'none';
            if (breathingInterval) {
                clearInterval(breathingInterval);
                breathingInterval = null;
            }
            phase = 'inhale';
            phaseTimer = 0;
            breathingInstructions.textContent = 'Click the circle to begin';
            this.announceToScreenReader('Breathing exercise stopped');
        };

        if (breathingCircle) {
            breathingCircle.addEventListener('click', () => {
                if (isBreathing) { stopBreathing(); } else { startBreathing(); }
            });
            breathingCircle.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    if (isBreathing) { stopBreathing(); } else { startBreathing(); }
                }
            });
        }
        if (playBtn) playBtn.addEventListener('click', startBreathing);
        if (pauseBtn) pauseBtn.addEventListener('click', stopBreathing);
        triggers.forEach(trigger => {
            trigger.addEventListener('click', () => {
                document.getElementById('relief').scrollIntoView({ behavior: 'smooth' });
                setTimeout(() => { if (!isBreathing) startBreathing(); }, 1000);
            });
        });
    }

    // ===== FLOATING AFFIRMATIONS =====
    initAffirmations() {
        const affirmations = document.querySelectorAll('.floating-affirmation');
        const affirmationMessages = [
            "Remember: You are stronger than you think ✨",
            "This feeling is temporary, you are permanent 🌟",
            "You deserve love and kindness, especially from yourself 💖",
            "Peace flows through you with every breath 🕊️"
        ];
        affirmations.forEach((affirmation, index) => {
            const handleClick = () => {
                this.announceToScreenReader(affirmationMessages[index]);
                affirmation.style.transform = 'scale(1.2) translateY(-10px)';
                setTimeout(() => { affirmation.style.transform = ''; }, 300);
            };
            affirmation.addEventListener('click', handleClick);
            affirmation.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleClick(); }
            });
        });
    }

    // ===== MOTIVATION CAROUSEL =====
    initMotivationCarousel() {
        const track = document.getElementById('motivation-track');
        const indicators = document.querySelector('.carousel-indicators');
        const prevBtn = document.querySelector('.carousel-prev');
        const nextBtn = document.querySelector('.carousel-next');

        if (!track) return;

        const motivations = [
            { text: "You have been assigned this mountain to show others it can be moved.", author: "Mel Robbins" },
            { text: "Your current situation is not your final destination. The best is yet to come.", author: "Unknown" },
            { text: "The only way out is through. And the way through is together.", author: "Unknown" },
            { text: "You are braver than you believe, stronger than you seem, and smarter than you think.", author: "A.A. Milne" },
            { text: "This too shall pass. It might pass like a kidney stone, but it will pass.", author: "Unknown" },
            { text: "You don't have to be positive all the time. It's perfectly okay to feel sad, angry, annoyed, frustrated, scared, or anxious. Having feelings doesn't make you a negative person.", author: "Lori Deschene" },
            { text: "Be gentle with yourself. You're doing the best you can.", author: "Unknown" },
            { text: "Your mental health is a priority. Your happiness is essential. Your self-care is a necessity.", author: "Unknown" }
        ];

        let currentSlide = 0;
        let autoplayInterval = null;

        motivations.forEach((motivation, index) => {
            const slide = document.createElement('div');
            slide.className = `carousel-slide ${index === 0 ? 'active' : ''}`;
            slide.innerHTML = `<p class="motivation-text">"${motivation.text}"</p><p class="motivation-author">— ${motivation.author}</p>`;
            track.appendChild(slide);
        });

        if (indicators) {
            motivations.forEach((_, index) => {
                const dot = document.createElement('button');
                dot.className = `carousel-dot ${index === 0 ? 'active' : ''}`;
                dot.setAttribute('role', 'tab');
                dot.setAttribute('aria-label', `Go to motivation ${index + 1}`);
                dot.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
                dot.addEventListener('click', () => goToSlide(index));
                indicators.appendChild(dot);
            });
        }

        const goToSlide = (slideIndex) => {
            document.querySelector('.carousel-slide.active')?.classList.remove('active');
            document.querySelector('.carousel-dot.active')?.classList.remove('active');
            const slides = document.querySelectorAll('.carousel-slide');
            const dots = document.querySelectorAll('.carousel-dot');
            slides[slideIndex]?.classList.add('active');
            dots[slideIndex]?.classList.add('active');
            dots[slideIndex]?.setAttribute('aria-selected', 'true');
            dots.forEach((dot, index) => {
                dot.setAttribute('aria-selected', index === slideIndex ? 'true' : 'false');
            });
            currentSlide = slideIndex;
            this.announceToScreenReader(`Showing motivation ${slideIndex + 1} of ${motivations.length}`);
            startAutoplay();
        };

        const nextSlide = () => {
            const nextIndex = (currentSlide + 1) % motivations.length;
            goToSlide(nextIndex);
        };
        const prevSlide = () => {
            const prevIndex = (currentSlide - 1 + motivations.length) % motivations.length;
            goToSlide(prevIndex);
        };

        const startAutoplay = () => {
            if (autoplayInterval) clearInterval(autoplayInterval);
            autoplayInterval = setInterval(nextSlide, 4000);
        };
        const stopAutoplay = () => {
            if (autoplayInterval) clearInterval(autoplayInterval);
        };

        if (nextBtn) {
            nextBtn.addEventListener('click', () => { stopAutoplay(); nextSlide(); });
        }
        if (prevBtn) {
            prevBtn.addEventListener('click', () => { stopAutoplay(); prevSlide(); });
        }
        document.addEventListener('keydown', (e) => {
            if (document.activeElement?.closest('.motivation-carousel')) {
                if (e.key === 'ArrowRight') { e.preventDefault(); stopAutoplay(); nextSlide(); }
                else if (e.key === 'ArrowLeft') { e.preventDefault(); stopAutoplay(); prevSlide(); }
            }
        });

        const carousel = document.querySelector('.motivation-carousel');
        if (carousel) {
            carousel.addEventListener('mouseenter', stopAutoplay);
            carousel.addEventListener('mouseleave', startAutoplay);
            carousel.addEventListener('focusin', stopAutoplay);
            carousel.addEventListener('focusout', startAutoplay);
        }
        startAutoplay();
    }

    // ===== ASSESSMENT MODAL =====
    initAssessment() {
        const modal = document.getElementById('assessment-modal');
        const triggers = document.querySelectorAll('.assessment-trigger');
        const closeBtn = modal?.querySelector('.modal-close');
        const backdrop = modal?.querySelector('.modal-backdrop');

        if (!modal) return;

        const questions = [
            { id: 1, text: "Over the past two weeks, how often have you felt down, depressed, or hopeless?", options: [{ text: "Not at all", value: 0 }, { text: "Several days", value: 1 }, { text: "More than half the days", value: 2 }, { text: "Nearly every day", value: 3 }] },
            { id: 2, text: "How often have you felt nervous, anxious, or on edge?", options: [{ text: "Not at all", value: 0 }, { text: "Several days", value: 1 }, { text: "More than half the days", value: 2 }, { text: "Nearly every day", value: 3 }] },
            { id: 3, text: "How would you rate your overall stress level recently?", options: [{ text: "Very low", value: 0 }, { text: "Low", value: 1 }, { text: "Moderate", value: 2 }, { text: "High", value: 3 }, { text: "Very high", value: 4 }] },
            { id: 4, text: "How well have you been sleeping?", options: [{ text: "Very well", value: 0 }, { text: "Fairly well", value: 1 }, { text: "Not very well", value: 2 }, { text: "Not well at all", value: 3 }] },
            { id: 5, text: "How often do you feel overwhelmed by daily responsibilities?", options: [{ text: "Never", value: 0 }, { text: "Rarely", value: 1 }, { text: "Sometimes", value: 2 }, { text: "Often", value: 3 }, { text: "Always", value: 4 }] },
            { id: 6, text: "How satisfied are you with your social connections and relationships?", options: [{ text: "Very satisfied", value: 0 }, { text: "Satisfied", value: 1 }, { text: "Neutral", value: 2 }, { text: "Dissatisfied", value: 3 }] },
            { id: 7, text: "How often do you engage in activities you enjoy?", options: [{ text: "Daily", value: 0 }, { text: "Several times a week", value: 1 }, { text: "Once a week", value: 2 }, { text: "Rarely", value: 3 }, { text: "Never", value: 4 }] },
            { id: 8, text: "How hopeful do you feel about the future?", options: [{ text: "Very hopeful", value: 0 }, { text: "Somewhat hopeful", value: 1 }, { text: "Neutral", value: 2 }, { text: "Not very hopeful", value: 3 }, { text: "Not hopeful at all", value: 4 }] }
        ];

        let currentQuestion = 0;
        let responses = [];
        let isOpen = false;

        const openModal = () => {
            isOpen = true;
            modal.setAttribute('aria-hidden', 'false');
            modal.style.display = 'flex';
            currentQuestion = 0;
            responses = [];
            showAssessmentContent();
            showQuestion(0);
            const firstFocusable = modal.querySelector('h2');
            if (firstFocusable) firstFocusable.focus();
            this.trapFocus(modal);
            this.announceToScreenReader('Assessment modal opened');
        };

        const closeModal = () => {
            isOpen = false;
            modal.setAttribute('aria-hidden', 'true');
            modal.style.display = 'none';
            const trigger = document.querySelector('.assessment-trigger');
            if (trigger) trigger.focus();
            this.announceToScreenReader('Assessment modal closed');
        };

        const showAssessmentContent = () => {
            document.getElementById('assessment-content').style.display = 'block';
            document.getElementById('assessment-results').style.display = 'none';
        };

        const showResults = () => {
            document.getElementById('assessment-content').style.display = 'none';
            document.getElementById('assessment-results').style.display = 'block';
        };

        const showQuestion = (index) => {
            const container = document.getElementById('question-container');
            const progressFill = document.querySelector('.progress-fill');
            const progressText = document.querySelector('.progress-text');
            const prevBtn = document.getElementById('prev-question');
            const nextBtn = document.getElementById('next-question');
            const question = questions[index];
            const progress = ((index + 1) / questions.length) * 100;

            if (progressFill) progressFill.style.width = `${progress}%`;
            if (progressText) progressText.textContent = `Question ${index + 1} of ${questions.length}`;
            if (prevBtn) prevBtn.disabled = index === 0;
            if (nextBtn) {
                nextBtn.textContent = index === questions.length - 1 ? 'Finish' : 'Next';
                nextBtn.disabled = !responses[index] || responses[index].value === undefined;
            }

            container.innerHTML = `
                <div class="question-text" role="group" aria-labelledby="question-${question.id}">
                    <h3 id="question-${question.id}">${question.text}</h3>
                    <div class="response-options" role="radiogroup" aria-labelledby="question-${question.id}">
                        ${question.options.map((option, optionIndex) => `
                        <div class="response-option ${responses[index]?.value === option.value ? 'selected' : ''}" data-value="${option.value}" tabindex="0" role="radio" aria-checked="${responses[index]?.value === option.value}">
                            <label for="q${question.id}_${optionIndex}">${option.text}</label>
                        </div>
                        `).join('')}
                    </div>
                </div>
            `;
            const options = container.querySelectorAll('.response-option');
            options.forEach(option => {
                const value = parseInt(option.dataset.value);
                const questionIndex = index;
                const handleClick = () => { selectOption(questionIndex, value); };
                option.addEventListener('click', handleClick);
                option.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleClick(); }
                });
            });
        };

        const selectOption = (questionIndex, value) => {
            responses[questionIndex] = { value };
            const options = document.querySelectorAll('.response-option');
            options.forEach(option => {
                const isSelected = parseInt(option.dataset.value) === value;
                option.classList.toggle('selected', isSelected);
                option.setAttribute('aria-checked', isSelected);
            });
            const nextBtn = document.getElementById('next-question');
            if (nextBtn) nextBtn.disabled = false;
            this.announceToScreenReader(`Selected option with value ${value}`);
        };

        const nextQuestion = () => {
            if (responses[currentQuestion] && responses[currentQuestion].value !== undefined) {
                if (currentQuestion < questions.length - 1) {
                    currentQuestion++;
                    showQuestion(currentQuestion);
                    this.announceToScreenReader(`Moving to question ${currentQuestion + 1}`);
                } else {
                    calculateResults();
                }
            } else {
                this.announceToScreenReader('Please select an option to continue.');
            }
        };

        const prevQuestion = () => {
            if (currentQuestion > 0) {
                currentQuestion--;
                showQuestion(currentQuestion);
                this.announceToScreenReader(`Moving back to question ${currentQuestion + 1}`);
            }
        };

        const calculateResults = () => {
            const totalScore = responses.reduce((sum, response) => sum + (response?.value || 0), 0);
            const maxScore = questions.reduce((sum, question) => sum + Math.max(...question.options.map(o => o.value)), 0);
            let category, description, recommendations;

            if (totalScore <= 7) {
                category = "Generally Well";
                description = "You seem to be managing well overall. Keep practicing self-care and maintain the positive habits that work for you.";
                recommendations = [
                    "Continue your current self-care practices",
                    "Maintain regular sleep and exercise routines",
                    "Stay connected with supportive people"
                ];
            } else if (totalScore <= 15) {
                category = "Mild Distress";
                description = "You may be experiencing some mild stress or emotional challenges. This is normal, and some self-care strategies might be helpful.";
                recommendations = [
                    "Try stress-reduction techniques like deep breathing",
                    "Consider guided meditation or mindfulness practices",
                    "Reach out to trusted friends or family for support"
                ];
            } else if (totalScore <= 23) {
                category = "Moderate Distress";
                description = "You might be going through a challenging time. Consider reaching out to trusted people in your life or exploring professional support options.";
                recommendations = [
                    "Consider speaking with a counselor or therapist",
                    "Practice regular stress-reduction techniques",
                    "Maintain check-ins with your support network"
                ];
            } else {
                category = "High Distress";
                description = "You may be experiencing significant distress. We strongly encourage you to reach out for professional support. Remember, seeking help is a sign of strength.";
                recommendations = [
                    "Strongly consider contacting a mental health professional",
                    "Reach out to crisis support resources if needed",
                    "Connect with trusted friends, family, or support groups"
                ];
            }
            showResults();
            document.getElementById('final-score').textContent = totalScore;
            document.getElementById('results-text').innerHTML = `
                <h4 style="color: var(--primary-600); margin-bottom: 1rem;">${category}</h4>
                <p style="margin-bottom: 1.5rem;">${description}</p>
                <div style="text-align: left;">
                    <h5 style="margin-bottom: 0.5rem;">Suggestions:</h5>
                    <ul style="margin: 0; padding-left: 1.5rem;">
                        ${recommendations.map(rec => `<li style="margin-bottom: 0.5rem;">${rec}</li>`).join('')}
                    </ul>
                </div>
                <p style="font-size: 0.9rem; color: var(--text-muted); font-style: italic; margin-top: 1.5rem;">
                    <strong>Important:</strong> This assessment is for self-reflection only and is not a diagnostic tool.
                    If you're in crisis, please contact emergency services or a crisis helpline immediately.
                </p>
            `;

            const assessmentData = {
                timestamp: new Date().toISOString(),
                responses, score: totalScore, category, maxScore
            };
            try {
                localStorage.setItem('alliswell_assessment', JSON.stringify(assessmentData));
            } catch (error) {
                console.error('Failed to save assessment locally:', error);
            }
            this.announceToScreenReader(`Assessment complete. Your wellness score is ${totalScore} out of ${maxScore}. Category: ${category}`);
        };

        const exportResults = () => {
            const data = localStorage.getItem('alliswell_assessment');
            if (!data) return;
            const assessment = JSON.parse(data);
            const exportText = `
ALL IS WELL - Wellness Check Results
Generated: ${new Date(assessment.timestamp).toLocaleString()}
Score: ${assessment.score}/${assessment.maxScore}
Category: ${assessment.category}
Questions & Responses:
${questions.map((q, i) => `
${i + 1}. ${q.text}
    Answer: ${q.options.find(o => o.value === assessment.responses[i]?.value)?.text || 'Not answered'}
`).join('')}
Important: This assessment is for self-reflection only and is not a diagnostic tool.
If you're in crisis, please contact emergency services or a crisis helpline immediately.
ALL IS WELL Mental Wellness App
            `.trim();
            const blob = new Blob([exportText], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `wellness-check-${new Date().toISOString().split('T')[0]}.txt`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            this.announceToScreenReader('Assessment results exported as text file');
        };

        const retakeAssessment = () => {
            currentQuestion = 0; responses = []; showAssessmentContent(); showQuestion(0);
            this.announceToScreenReader('Retaking assessment');
        };

        // Event listeners
        // IMPORTANT: The assessment-trigger buttons now just open the modal.
        // The EJS template handles whether the button is a <button> or an <a> tag.
        // Only the <button> should call openModal().
        triggers.forEach(trigger => {
            if (trigger.tagName === 'BUTTON') {
                trigger.addEventListener('click', openModal);
            }
        });
        if (closeBtn) closeBtn.addEventListener('click', closeModal);
        if (backdrop) backdrop.addEventListener('click', closeModal);

        const prevBtn = document.getElementById('prev-question');
        const nextBtn = document.getElementById('next-question');
        if (prevBtn) prevBtn.addEventListener('click', prevQuestion);
        if (nextBtn) nextBtn.addEventListener('click', nextQuestion);
        
        const exportBtn = document.getElementById('export-results');
        const retakeBtn = document.getElementById('retake-assessment');
        if (exportBtn) exportBtn.addEventListener('click', exportResults);
        if (retakeBtn) retakeBtn.addEventListener('click', retakeAssessment);

        document.addEventListener('keydown', (e) => {
            if (isOpen && e.key === 'Escape') closeModal();
        });
        
        // Expose openModal to be called from initURLParams
        this.openAssessmentModal = openModal;
    }

    // ===== CHAT INTERFACE =====
    initChat() {
        const toggle = document.getElementById('chat-toggle');
        const panel = document.getElementById('chat-panel');
        const closeBtn = panel?.querySelector('.chat-close');
        const form = document.getElementById('chat-form');
        const input = document.getElementById('chat-input');
        const messages = document.getElementById('chat-messages');

        if (!toggle || !panel) return;

        let isChatOpen = false;
        let messageHistory = [];

        const crisisKeywords = ['kill myself', 'end my life', 'suicide', 'suicidal', 'want to die', 'hurt myself', 'self harm', 'overdose', 'can\'t go on', 'no point living', 'better off dead', 'end it all', 'harm myself'];

        const openChat = () => {
            isChatOpen = true;
            panel.setAttribute('aria-hidden', 'false');
            input.focus();
            this.announceToScreenReader('Chat panel opened');
        };
        const closeChat = () => {
            isChatOpen = false;
            panel.setAttribute('aria-hidden', 'true');
            toggle.focus();
            this.announceToScreenReader('Chat panel closed');
        };

        const detectCrisisKeywords = (message) => {
            const lowerMessage = message.toLowerCase();
            return crisisKeywords.some(keyword => lowerMessage.includes(keyword));
        };

        const addMessage = (content, isUser = false, isTyping = false) => {
            const messageElement = document.createElement('div');
            messageElement.className = `chat-message ${isUser ? 'user-message' : 'bot-message'} ${isTyping ? 'typing' : ''}`;
            messageElement.innerHTML = `
                <div class="message-content">
                    <p>${isTyping ? '...' : content}</p>
                </div>
                ${isTyping ? '' : `<div class="message-time" aria-label="Message sent at">${new Date().toLocaleTimeString()}</div>`}
            `;
            messages.appendChild(messageElement);
            messages.scrollTop = messages.scrollHeight;

            if (!isTyping) {
                messageHistory.push({ role: isUser ? 'user' : 'model', text: content });
                this.announceToScreenReader(`${isUser ? 'You' : 'Support'}: ${content}`);
            }
            return messageElement;
        };

        const handleSubmit = async (e) => {
            e.preventDefault();
            const userMessage = input.value.trim();
            if (!userMessage) return;
            addMessage(userMessage, true);
            input.value = '';
            const typingIndicator = addMessage('', false, true);

            if (detectCrisisKeywords(userMessage)) {
                messages.removeChild(typingIndicator);
                this.showCrisisModal();
                addMessage("I'm concerned about what you've shared. Please use the resources I'm providing to get immediate support.", false);
                return;
            }

            try {
                const response = await fetch('/api/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message: userMessage, history: messageHistory })
                });

                messages.removeChild(typingIndicator);

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Server responded with an error');
                }

                const data = await response.json();
                const aiMessage = data.message;
                addMessage(aiMessage, false);

            } catch (error) {
                console.error('Error sending message to server:', error);
                if (messages.contains(typingIndicator)) {
                    messages.removeChild(typingIndicator);
                }
                addMessage('⚠️ An error occurred. Please try again.', false);
            }
        };

        // Event listeners
        // The click event listener is now a direct open/close toggle.
        // The EJS template handles whether the button exists or is an <a> tag.
        toggle.addEventListener('click', () => {
            if (isChatOpen) { closeChat(); } else { openChat(); }
        });
        toggle.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); if (isChatOpen) { closeChat(); } else { openChat(); } }
        });
        if (closeBtn) closeBtn.addEventListener('click', closeChat);
        if (form) form.addEventListener('submit', handleSubmit);
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && isChatOpen) closeChat();
        });
        if (input) {
            input.addEventListener('input', () => {
                input.style.height = 'auto';
                input.style.height = input.scrollHeight + 'px';
            });
        }
        // Expose openChat to be called from initURLParams
        this.openChatPanel = openChat;
    }

    // ===== CRISIS SUPPORT MODAL =====
    showCrisisModal() {
        const modal = document.getElementById('crisis-modal');
        if (!modal) return;
        modal.setAttribute('aria-hidden', 'false');
        modal.style.display = 'flex';
        const firstFocusable = modal.querySelector('h2');
        if (firstFocusable) firstFocusable.focus();
        this.trapFocus(modal);
        this.announceToScreenReader('Crisis support modal opened. Immediate help resources are available.');
        const closeBtn = modal.querySelector('.crisis-close');
        const backdrop = modal.querySelector('.modal-backdrop');
        const closeModal = () => {
            modal.setAttribute('aria-hidden', 'true');
            modal.style.display = 'none';
            this.announceToScreenReader('Crisis support modal closed');
        };
        if (closeBtn) closeBtn.addEventListener('click', closeModal);
        if (backdrop) backdrop.addEventListener('click', closeModal);
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeModal();
        });
    }

    // ===== ACCESSIBILITY UTILITIES =====
    initAccessibility() {
        this.announcements = document.getElementById('announcements');
        if (!this.announcements) {
            this.announcements = document.createElement('div');
            this.announcements.id = 'announcements';
            this.announcements.className = 'sr-only';
            this.announcements.setAttribute('aria-live', 'assertive');
            this.announcements.setAttribute('aria-atomic', 'true');
            document.body.appendChild(this.announcements);
        }
    }
    announceToScreenReader(message) {
        if (this.announcements) {
            this.announcements.textContent = message;
            setTimeout(() => { this.announcements.textContent = ''; }, 1000);
        }
    }
    trapFocus(element) {
        const focusableElements = element.querySelectorAll(
            'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]):not([disabled]), details, summary'
        );
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];
        const handleTabKey = (e) => {
            if (e.key !== 'Tab') return;
            if (e.shiftKey) {
                if (document.activeElement === firstFocusable) {
                    lastFocusable.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastFocusable) {
                    firstFocusable.focus();
                    e.preventDefault();
                }
            }
        };
        element.addEventListener('keydown', handleTabKey);
        return () => { element.removeEventListener('keydown', handleTabKey); };
    }

    // ===== URL PARAMETERS =====
    initURLParams() {
        const params = new URLSearchParams(window.location.search);

        if (params.get('openAssessment') === 'true' && typeof this.openAssessmentModal === 'function') {
            setTimeout(() => {
                this.openAssessmentModal();
                // Clear the URL parameter so it doesn't reopen on refresh
                window.history.replaceState({}, document.title, window.location.pathname);
            }, 500); 
        }

        if (params.get('openChat') === 'true' && typeof this.openChatPanel === 'function') {
            setTimeout(() => {
                this.openChatPanel();
                // Clear the URL parameter
                window.history.replaceState({}, document.title, window.location.pathname);
            }, 500);
        }
    }
}

const app = new AllIsWellApp();

// Export for potential use by other scripts
window.AllIsWellApp = AllIsWellApp;