import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Check, Menu, X, Phone, Mail, MapPin, Instagram, ChevronDown, Shield, Star, Clock, Award } from 'lucide-react'

// ─── Design Tokens ───
const colors = {
  goldPrimary: '#C9A84C',
  goldLight: '#E8D48B',
  goldDark: '#A07C2A',
  goldSubtle: 'rgba(201,168,76,0.08)',
  bgPrimary: '#0A0A0A',
  bgSecondary: '#111111',
  bgCard: '#1A1A1A',
  bgInput: '#141414',
  textPrimary: '#FFFFFF',
  textSecondary: '#BBBBBB',
  textMuted: '#777777',
  textDim: '#555555',
  borderSubtle: 'rgba(201,168,76,0.06)',
  borderHover: 'rgba(201,168,76,0.25)',
}

const fonts = {
  heading: "'Playfair Display', Georgia, serif",
  body: "'Inter', system-ui, sans-serif",
}

const transition = 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'

// ─── Reusable Components ───

function FadeIn({ children, delay = 0, direction = 'up', className = '' }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          obs.unobserve(el)
        }
      },
      { threshold: 0.15 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const transforms = {
    up: 'translateY(40px)',
    left: 'translateX(-40px)',
    right: 'translateX(40px)',
    none: 'none',
  }

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'none' : transforms[direction],
        transition: `opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
      }}
    >
      {children}
    </div>
  )
}

function GoldButton({ children, onClick, large = false, fullWidth = false, type = 'button' }) {
  const [hovered, setHovered] = useState(false)
  return (
    <button
      type={type}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered
          ? `linear-gradient(135deg, ${colors.goldLight}, ${colors.goldPrimary})`
          : `linear-gradient(135deg, ${colors.goldPrimary}, ${colors.goldDark})`,
        color: '#0A0A0A',
        fontFamily: fonts.body,
        fontWeight: 700,
        fontSize: large ? '15px' : '13px',
        letterSpacing: '1.5px',
        textTransform: 'uppercase',
        padding: large ? '18px 40px' : '14px 32px',
        borderRadius: '6px',
        border: 'none',
        cursor: 'pointer',
        width: fullWidth ? '100%' : 'auto',
        transform: hovered ? 'translateY(-2px)' : 'none',
        boxShadow: hovered ? '0 8px 32px rgba(201,168,76,0.25)' : '0 4px 16px rgba(201,168,76,0.1)',
        transition,
      }}
    >
      {children}
    </button>
  )
}

function GoldOutlineButton({ children, onClick, href }) {
  const [hovered, setHovered] = useState(false)
  const Tag = href ? 'a' : 'button'
  return (
    <Tag
      href={href}
      target={href ? '_blank' : undefined}
      rel={href ? 'noopener noreferrer' : undefined}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        border: `1px solid rgba(201,168,76,0.25)`,
        color: colors.goldPrimary,
        fontFamily: fonts.body,
        fontWeight: 600,
        fontSize: '13px',
        letterSpacing: '0.5px',
        padding: '14px 32px',
        borderRadius: '6px',
        background: hovered ? 'rgba(201,168,76,0.06)' : 'transparent',
        cursor: 'pointer',
        textDecoration: 'none',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        transition,
      }}
    >
      {children}
    </Tag>
  )
}

function SectionTitle({ subtitle, title }) {
  return (
    <div style={{ textAlign: 'center', marginBottom: '56px' }}>
      <FadeIn>
        <p
          style={{
            fontFamily: fonts.body,
            fontSize: '12px',
            fontWeight: 600,
            letterSpacing: '3.5px',
            textTransform: 'uppercase',
            color: colors.goldPrimary,
            marginBottom: '16px',
          }}
        >
          {subtitle}
        </p>
      </FadeIn>
      <FadeIn delay={0.1}>
        <h2
          style={{
            fontFamily: fonts.heading,
            fontWeight: 300,
            fontSize: 'clamp(26px, 4vw, 40px)',
            lineHeight: 1.15,
            color: colors.textPrimary,
            marginBottom: '24px',
          }}
        >
          {title}
        </h2>
      </FadeIn>
      <FadeIn delay={0.2}>
        <GoldDivider centered />
      </FadeIn>
    </div>
  )
}

function GoldDivider({ centered = false }) {
  return (
    <div
      style={{
        width: '60px',
        height: '2px',
        background: `linear-gradient(90deg, transparent, ${colors.goldPrimary}, transparent)`,
        margin: centered ? '0 auto' : '0',
      }}
    />
  )
}

function SectionSeparator() {
  return (
    <div
      style={{
        width: '100%',
        height: '1px',
        background: `linear-gradient(90deg, transparent, rgba(201,168,76,0.12), transparent)`,
      }}
    />
  )
}

// ─── Scroll helper ───
function scrollToForm() {
  document.getElementById('form-section')?.scrollIntoView({ behavior: 'smooth' })
}

// ─── Main App ───
export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const [openFaq, setOpenFaq] = useState(null)
  const [formData, setFormData] = useState({ nome: '', email: '', whatsapp: '' })
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    const handleResize = () => setWindowWidth(window.innerWidth)
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const isMobile = windowWidth < 768

  const handleFormSubmit = (e) => {
    e.preventDefault()
    if (!formData.nome || !formData.email || !formData.whatsapp) return
    setFormSubmitted(true)
    setTimeout(() => {
      window.open(
        `https://wa.me/5511919148575?text=${encodeURIComponent(`Olá Dr. Gatti, gostaria de agendar uma avaliação! Meu nome é ${formData.nome}`)}`,
        '_blank'
      )
    }, 1500)
  }

  const navLinks = [
    { label: 'Procedimentos', href: '#procedimentos' },
    { label: 'Resultados', href: '#resultados' },
    { label: 'Depoimentos', href: '#depoimentos' },
    { label: 'FAQ', href: '#faq' },
  ]

  const handleNavClick = (href) => {
    setMobileMenuOpen(false)
    const el = document.querySelector(href)
    el?.scrollIntoView({ behavior: 'smooth' })
  }

  // ─── RENDER ───
  return (
    <div style={{ fontFamily: fonts.body, overflowX: 'hidden' }}>

      {/* ─── NAVBAR ─── */}
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          background: 'rgba(10,10,10,0.8)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: `1px solid ${colors.borderSubtle}`,
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 24px',
            height: '72px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Logo */}
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
            style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}
          >
            <span
              style={{
                fontFamily: fonts.heading,
                fontSize: '18px',
                fontWeight: 400,
                color: colors.textPrimary,
                letterSpacing: '0.5px',
              }}
            >
              Dr. Luiz Gatti
            </span>
          </a>

          {/* Desktop Links */}
          {!isMobile && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault()
                    handleNavClick(link.href)
                  }}
                  style={{
                    color: colors.textSecondary,
                    textDecoration: 'none',
                    fontSize: '13px',
                    fontWeight: 500,
                    letterSpacing: '0.5px',
                    transition,
                  }}
                  onMouseEnter={(e) => (e.target.style.color = colors.goldPrimary)}
                  onMouseLeave={(e) => (e.target.style.color = colors.textSecondary)}
                >
                  {link.label}
                </a>
              ))}
              <GoldButton onClick={scrollToForm}>Agende sua Avaliação</GoldButton>
            </div>
          )}

          {/* Mobile Hamburger */}
          {isMobile && (
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: colors.goldPrimary,
                padding: '8px',
              }}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          )}
        </div>

        {/* Mobile Menu */}
        {isMobile && mobileMenuOpen && (
          <div
            style={{
              position: 'fixed',
              top: '72px',
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(10,10,10,0.97)',
              backdropFilter: 'blur(20px)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '32px',
              zIndex: 999,
            }}
          >
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault()
                  handleNavClick(link.href)
                }}
                style={{
                  color: colors.textPrimary,
                  textDecoration: 'none',
                  fontSize: '20px',
                  fontFamily: fonts.heading,
                  fontWeight: 300,
                  letterSpacing: '1px',
                }}
              >
                {link.label}
              </a>
            ))}
            <GoldButton onClick={() => { setMobileMenuOpen(false); scrollToForm() }}>
              Agende sua Avaliação
            </GoldButton>
          </div>
        )}
      </nav>

      {/* ─── HERO SECTION ─── */}
      <section
        style={{
          minHeight: '100vh',
          background: colors.bgPrimary,
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          paddingTop: '72px',
        }}
      >
        {/* Decorative circles */}
        <div
          style={{
            position: 'absolute',
            top: '-20%',
            right: '-10%',
            width: '600px',
            height: '600px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 70%)',
            transform: `translateY(${scrollY * 0.05}px)`,
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-30%',
            left: '-15%',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(201,168,76,0.04) 0%, transparent 70%)',
            transform: `translateY(${scrollY * -0.03}px)`,
            pointerEvents: 'none',
          }}
        />

        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '60px 24px',
            width: '100%',
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
            gap: isMobile ? '48px' : '64px',
            alignItems: 'center',
          }}
        >
          {/* Left Column — Text */}
          <div style={{ textAlign: isMobile ? 'center' : 'left' }}>
            <FadeIn delay={0}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '8px 18px',
                  borderRadius: '50px',
                  border: `1px solid rgba(201,168,76,0.2)`,
                  marginBottom: '28px',
                }}
              >
                <div
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: colors.goldPrimary,
                    boxShadow: `0 0 12px ${colors.goldPrimary}`,
                  }}
                />
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    letterSpacing: '2px',
                    textTransform: 'uppercase',
                    color: colors.goldPrimary,
                  }}
                >
                  Excelência em Estética Médica
                </span>
              </div>
            </FadeIn>

            <FadeIn delay={0.1}>
              <h1
                style={{
                  fontFamily: fonts.heading,
                  fontWeight: 300,
                  fontSize: 'clamp(34px, 5vw, 56px)',
                  lineHeight: 1.15,
                  color: colors.textPrimary,
                  marginBottom: '24px',
                }}
              >
                Sua melhor versão merece
                <br />
                <em style={{ color: colors.goldPrimary, fontStyle: 'italic' }}>as melhores mãos.</em>
              </h1>
            </FadeIn>

            <FadeIn delay={0.2}>
              <p
                style={{
                  fontSize: '16px',
                  lineHeight: 1.7,
                  color: colors.textSecondary,
                  maxWidth: isMobile ? '100%' : '500px',
                  marginBottom: '16px',
                }}
              >
                Estética corporal e facial com técnicas exclusivas, resultados naturais e total segurança médica.
              </p>
            </FadeIn>

            <FadeIn delay={0.25}>
              <p
                style={{
                  fontSize: '13px',
                  lineHeight: 1.6,
                  color: colors.textMuted,
                  maxWidth: isMobile ? '100%' : '500px',
                  marginBottom: '32px',
                }}
              >
                Dr. Luiz Gatti — referência em remodelamento glúteo, bioestimuladores e minilipo. São Paulo · Alphaville · Campinas
              </p>
            </FadeIn>

            <FadeIn delay={0.3}>
              <div
                style={{
                  display: 'flex',
                  gap: '16px',
                  marginBottom: '48px',
                  flexWrap: 'wrap',
                  justifyContent: isMobile ? 'center' : 'flex-start',
                }}
              >
                <GoldButton onClick={scrollToForm} large>
                  Agende sua Avaliação
                </GoldButton>
                <GoldOutlineButton href="https://instagram.com/dr.luizgatti">
                  <Instagram size={16} /> @dr.luizgatti
                </GoldOutlineButton>
              </div>
            </FadeIn>

            <FadeIn delay={0.4}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '24px',
                  maxWidth: isMobile ? '100%' : '420px',
                }}
              >
                {[
                  { number: '100+', label: 'Procedimentos' },
                  { number: '25+', label: 'Anos' },
                  { number: '3', label: 'Unidades' },
                ].map((stat) => (
                  <div key={stat.label} style={{ textAlign: isMobile ? 'center' : 'left' }}>
                    <div
                      style={{
                        fontFamily: fonts.heading,
                        fontSize: '28px',
                        fontWeight: 400,
                        color: colors.goldPrimary,
                        lineHeight: 1.2,
                      }}
                    >
                      {stat.number}
                    </div>
                    <div
                      style={{
                        fontSize: '11px',
                        fontWeight: 600,
                        letterSpacing: '2px',
                        textTransform: 'uppercase',
                        color: colors.textMuted,
                        marginTop: '4px',
                      }}
                    >
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>

          {/* Right Column — Photo */}
          <FadeIn delay={0.2} direction={isMobile ? 'up' : 'right'}>
            <div style={{ position: 'relative' }}>
              {/* Frame accent */}
              <div
                style={{
                  position: 'absolute',
                  top: '-16px',
                  right: '-16px',
                  width: '70%',
                  height: '70%',
                  border: `1px solid rgba(201,168,76,0.15)`,
                  borderRadius: '8px',
                  pointerEvents: 'none',
                }}
              />
              {/* Photo container */}
              <div
                style={{
                  aspectRatio: '3/4',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  border: `1px solid rgba(201,168,76,0.1)`,
                  position: 'relative',
                  background: `linear-gradient(135deg, ${colors.bgCard}, rgba(201,168,76,0.05))`,
                }}
              >
                <img
                  src="perfil.webp"
                  alt="Dr. Luiz Gatti"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center top',
                    display: 'block',
                  }}
                />
              </div>
              {/* Floating badge */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '24px',
                  left: '-12px',
                  background: `linear-gradient(135deg, ${colors.goldPrimary}, ${colors.goldDark})`,
                  padding: '12px 20px',
                  borderRadius: '6px',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                }}
              >
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                    color: '#0A0A0A',
                  }}
                >
                  Dr. Luiz Gatti
                </span>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      <SectionSeparator />

      {/* ─── PROCEDIMENTOS ─── */}
      <section
        id="procedimentos"
        style={{ background: colors.bgPrimary, padding: '100px 24px' }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <SectionTitle subtitle="Procedimentos" title="Excelência em cada detalhe" />
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '24px',
            }}
          >
            {[
              {
                icon: '✦',
                title: 'Remodelamento Glúteo',
                desc: 'Volume, definição e naturalidade em um único procedimento com técnicas avançadas de preenchimento.',
                highlights: ['Volume personalizado', 'Correção trocantérica', 'Resultado permanente'],
              },
              {
                icon: '◇',
                title: 'Bioestimuladores de Colágeno',
                desc: 'Firmeza, sustentação e rejuvenescimento progressivo — sem cortes e sem afastamento da rotina.',
                highlights: ['Firmeza e sustentação real', 'Resultados progressivos', 'Zero downtime'],
              },
              {
                icon: '⬡',
                title: 'Minilipo',
                desc: 'Remoção de gordura localizada com precisão e recuperação rápida. Contornos definidos de forma minimamente invasiva.',
                highlights: ['Gordura localizada', 'Recuperação expressa', 'Contornos definidos'],
              },
            ].map((card, i) => (
              <ProcedureCard key={card.title} card={card} delay={i * 0.1} />
            ))}
          </div>
        </div>
      </section>

      <SectionSeparator />

      {/* ─── DIGA ADEUS À FLACIDEZ ─── */}
      <section style={{ background: colors.bgPrimary, padding: '100px 24px' }}>
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
            gap: '64px',
            alignItems: 'center',
          }}
        >
          <FadeIn direction={isMobile ? 'up' : 'left'}>
            <div
              style={{
                aspectRatio: '4/5',
                borderRadius: '8px',
                overflow: 'hidden',
                border: `1px solid rgba(201,168,76,0.1)`,
              }}
            >
              <img
                src="resultado-destaque.webp"
                alt="Resultado de transformação corporal"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center top',
                  display: 'block',
                }}
              />
            </div>
          </FadeIn>

          <div>
            <FadeIn>
              <p
                style={{
                  fontFamily: fonts.body,
                  fontSize: '12px',
                  fontWeight: 600,
                  letterSpacing: '3.5px',
                  textTransform: 'uppercase',
                  color: colors.goldPrimary,
                  marginBottom: '16px',
                }}
              >
                Transformação Real
              </p>
            </FadeIn>
            <FadeIn delay={0.1}>
              <h2
                style={{
                  fontFamily: fonts.heading,
                  fontWeight: 300,
                  fontSize: 'clamp(26px, 4vw, 38px)',
                  lineHeight: 1.2,
                  color: colors.textPrimary,
                  marginBottom: '24px',
                }}
              >
                Diga adeus à flacidez e conquiste o corpo que você merece
              </h2>
            </FadeIn>
            <FadeIn delay={0.15}>
              <p
                style={{
                  fontSize: '15px',
                  lineHeight: 1.7,
                  color: colors.textSecondary,
                  marginBottom: '32px',
                }}
              >
                Preenchimento glúteo, bioestimuladores e minilipo — resultados naturais com segurança total e recuperação rápida.
              </p>
            </FadeIn>
            <FadeIn delay={0.2}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '36px' }}>
                {[
                  'Aumento de volume e definição sob medida',
                  'Resultados duradouros adaptados ao seu biotipo',
                  'Sem cirurgia — procedimento minimamente invasivo',
                  'Acompanhamento completo por 12 meses',
                ].map((benefit, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        background: 'rgba(201,168,76,0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Check size={14} color={colors.goldPrimary} />
                    </div>
                    <span style={{ fontSize: '15px', color: colors.textSecondary }}>{benefit}</span>
                  </div>
                ))}
              </div>
            </FadeIn>
            <FadeIn delay={0.3}>
              <GoldButton onClick={scrollToForm} large>
                Quero minha transformação
              </GoldButton>
            </FadeIn>
          </div>
        </div>
      </section>

      <SectionSeparator />

      {/* ─── RESULTADOS ─── */}
      <section id="resultados" style={{ background: colors.bgPrimary, padding: '100px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <SectionTitle subtitle="Transformações" title="Resultados que falam por si" />
          <FadeIn>
            <p
              style={{
                textAlign: 'center',
                fontSize: '15px',
                color: colors.textSecondary,
                maxWidth: '600px',
                margin: '-32px auto 48px',
                lineHeight: 1.7,
              }}
            >
              Cada procedimento é planejado individualmente para resultados verdadeiramente naturais.
            </p>
          </FadeIn>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '20px',
              marginBottom: '48px',
            }}
          >
            {[1, 2, 3, 4].map((num, i) => (
              <FadeIn key={num} delay={i * 0.1}>
                <div
                  style={{
                    position: 'relative',
                    aspectRatio: '4/5',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    background: `linear-gradient(135deg, ${colors.bgCard}, rgba(201,168,76,0.06))`,
                    border: `1px solid ${colors.borderSubtle}`,
                  }}
                >
                  <img
                    src={`resultado${num}.webp`}
                    alt={`Resultado antes e depois ${num}`}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: 'center top',
                      display: 'block',
                    }}
                  />
                </div>
              </FadeIn>
            ))}
          </div>
          <FadeIn>
            <div style={{ textAlign: 'center' }}>
              <GoldButton onClick={scrollToForm} large>
                Agende sua avaliação gratuita
              </GoldButton>
            </div>
          </FadeIn>
        </div>
      </section>

      <SectionSeparator />

      {/* ─── BENEFÍCIOS ─── */}
      <section style={{ background: colors.bgPrimary, padding: '100px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <SectionTitle subtitle="Diferenciais" title="O padrão de excelência que você merece" />
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '24px',
            }}
          >
            {[
              { emoji: '🛡️', title: 'Segurança Absoluta', desc: 'Ambiente médico controlado com protocolos rigorosos.' },
              { emoji: '🎯', title: 'Naturalidade Garantida', desc: 'Técnicas que respeitam a harmonia do seu corpo.' },
              { emoji: '⚡', title: 'Recuperação Expressa', desc: 'Volte à sua rotina no mesmo dia.' },
              { emoji: '📋', title: '1 Ano de Acompanhamento', desc: 'Retornos periódicos e suporte completo.' },
              { emoji: '💎', title: 'Técnicas Exclusivas', desc: 'O que há de mais avançado em estética médica.' },
              { emoji: '📍', title: '3 Unidades Premium', desc: 'São Paulo, Alphaville e Campinas.' },
            ].map((item, i) => (
              <FadeIn key={item.title} delay={i * 0.08}>
                <BenefitCard item={item} />
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <SectionSeparator />

      {/* ─── FORMULÁRIO ─── */}
      <section
        id="form-section"
        style={{
          background: colors.bgPrimary,
          padding: '100px 24px',
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
            gap: '64px',
            alignItems: 'start',
          }}
        >
          {/* Form */}
          <FadeIn>
            <div
              style={{
                background: colors.bgCard,
                border: `1px solid rgba(201,168,76,0.1)`,
                borderRadius: '12px',
                padding: isMobile ? '32px 24px' : '48px',
              }}
            >
              {!formSubmitted ? (
                <>
                  <h3
                    style={{
                      fontFamily: fonts.heading,
                      fontWeight: 400,
                      fontSize: '28px',
                      color: colors.textPrimary,
                      marginBottom: '8px',
                    }}
                  >
                    Agende sua Avaliação
                  </h3>
                  <p
                    style={{
                      fontSize: '14px',
                      color: colors.textMuted,
                      marginBottom: '32px',
                    }}
                  >
                    Preencha abaixo e nossa equipe entrará em contato pelo WhatsApp.
                  </p>
                  <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <FormInput
                      placeholder="Seu nome completo"
                      value={formData.nome}
                      onChange={(v) => setFormData({ ...formData, nome: v })}
                    />
                    <FormInput
                      placeholder="Seu melhor e-mail"
                      type="email"
                      value={formData.email}
                      onChange={(v) => setFormData({ ...formData, email: v })}
                    />
                    <FormInput
                      placeholder="Seu WhatsApp com DDD"
                      type="tel"
                      value={formData.whatsapp}
                      onChange={(v) => setFormData({ ...formData, whatsapp: v })}
                    />
                    <div style={{ marginTop: '8px' }}>
                      <GoldButton type="submit" fullWidth large>
                        AGENDAR MINHA AVALIAÇÃO GRATUITA
                      </GoldButton>
                    </div>
                  </form>
                  <p
                    style={{
                      fontSize: '12px',
                      color: colors.textDim,
                      marginTop: '16px',
                      textAlign: 'center',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                    }}
                  >
                    🔒 Seus dados estão seguros e não serão compartilhados.
                  </p>
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <div
                    style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '50%',
                      background: 'rgba(201,168,76,0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 20px',
                    }}
                  >
                    <Check size={28} color={colors.goldPrimary} />
                  </div>
                  <h3
                    style={{
                      fontFamily: fonts.heading,
                      fontSize: '22px',
                      color: colors.textPrimary,
                      marginBottom: '12px',
                    }}
                  >
                    Recebemos seus dados!
                  </h3>
                  <p style={{ fontSize: '14px', color: colors.textSecondary }}>
                    Redirecionando para o WhatsApp...
                  </p>
                </div>
              )}
            </div>
          </FadeIn>

          {/* Right side text */}
          <FadeIn delay={0.2}>
            <div style={{ paddingTop: isMobile ? '0' : '24px' }}>
              <h3
                style={{
                  fontFamily: fonts.heading,
                  fontWeight: 300,
                  fontSize: 'clamp(24px, 3vw, 32px)',
                  lineHeight: 1.2,
                  color: colors.textPrimary,
                  marginBottom: '36px',
                }}
              >
                Dê o primeiro passo para a sua transformação
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '40px' }}>
                {[
                  'Avaliação personalizada e sem compromisso',
                  'Plano de tratamento exclusivo para você',
                  'Condições especiais para quem agenda esta semana',
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                    <div
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        background: 'rgba(201,168,76,0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        marginTop: '2px',
                      }}
                    >
                      <Check size={14} color={colors.goldPrimary} />
                    </div>
                    <span style={{ fontSize: '15px', color: colors.textSecondary, lineHeight: 1.6 }}>
                      {item}
                    </span>
                  </div>
                ))}
              </div>
              <div
                style={{
                  padding: '20px 24px',
                  borderRadius: '8px',
                  border: `1px solid ${colors.borderSubtle}`,
                  background: 'rgba(201,168,76,0.03)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MapPin size={16} color={colors.goldPrimary} />
                  <span style={{ fontSize: '14px', color: colors.textSecondary }}>
                    São Paulo · Alphaville · Campinas
                  </span>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      <SectionSeparator />

      {/* ─── DEPOIMENTOS ─── */}
      <section id="depoimentos" style={{ background: colors.bgPrimary, padding: '100px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <SectionTitle subtitle="Depoimentos" title="Quem viveu, recomenda" />
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))',
              gap: '24px',
            }}
          >
            {[
              {
                photo: 'depoimento1.webp',
                name: 'Maria J.',
                text: 'Resultado absurdamente natural. Ninguém acredita que foi procedimento. Dr. Gatti tem mãos de artista!',
              },
              {
                photo: 'depoimento2.webp',
                name: 'Ana S.',
                text: 'O resultado superou todas as expectativas. Me sinto outra pessoa — a confiança voltou!',
              },
              {
                photo: 'depoimento3.webp',
                name: 'Carla M.',
                text: 'Os bioestimuladores mudaram minha pele. O atendimento é impecável do início ao fim.',
              },
              {
                photo: 'depoimento4.webp',
                name: 'Juliana R.',
                text: 'Acompanhamento impecável. Me senti segura o tempo todo. Recomendo de olhos fechados!',
              },
            ].map((dep, i) => (
              <FadeIn key={dep.name} delay={i * 0.1}>
                <TestimonialCard dep={dep} />
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <SectionSeparator />

      {/* ─── FAQ ─── */}
      <section id="faq" style={{ background: colors.bgPrimary, padding: '100px 24px' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <SectionTitle subtitle="Dúvidas" title="Perguntas Frequentes" />
          {[
            {
              q: 'O preenchimento glúteo dói?',
              a: 'Realizado com anestesia local, garantindo conforto total. A maioria das pacientes relata apenas uma leve pressão.',
            },
            {
              q: 'Quais são os riscos?',
              a: 'Riscos mínimos quando realizado por profissional qualificado em ambiente controlado, com materiais de última geração.',
            },
            {
              q: 'Quantas sessões são necessárias?',
              a: 'Remodelamento glúteo e minilipo: geralmente uma sessão. Bioestimuladores: 2 a 3 sessões. Na avaliação, traçamos o plano completo.',
            },
            {
              q: 'Quanto tempo dura o resultado?',
              a: 'Preenchimento glúteo: permanente. Bioestimuladores: 2 a 3 anos. Minilipo: definitiva na região tratada.',
            },
            {
              q: 'Gestantes podem fazer o procedimento?',
              a: 'Não. Durante gestação e amamentação, procedimentos estéticos invasivos são contraindicados.',
            },
            {
              q: 'Como funciona o acompanhamento?',
              a: 'Acompanhamento completo por 12 meses com retornos periódicos para garantir a melhor evolução.',
            },
          ].map((item, i) => (
            <FadeIn key={i} delay={i * 0.05}>
              <FaqItem
                question={item.q}
                answer={item.a}
                isOpen={openFaq === i}
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              />
            </FadeIn>
          ))}
        </div>
      </section>

      <SectionSeparator />

      {/* ─── CTA FINAL ─── */}
      <section
        style={{
          background: colors.bgPrimary,
          padding: '100px 24px',
          borderTop: `1px solid rgba(201,168,76,0.08)`,
          borderBottom: `1px solid rgba(201,168,76,0.08)`,
        }}
      >
        <div style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center' }}>
          <FadeIn>
            <h2
              style={{
                fontFamily: fonts.heading,
                fontWeight: 300,
                fontSize: 'clamp(28px, 4vw, 42px)',
                lineHeight: 1.2,
                color: colors.textPrimary,
                marginBottom: '20px',
              }}
            >
              Sua transformação começa com uma decisão
            </h2>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p
              style={{
                fontSize: '15px',
                lineHeight: 1.7,
                color: colors.textSecondary,
                marginBottom: '36px',
              }}
            >
              Agende sua avaliação e descubra o plano ideal para você.
            </p>
          </FadeIn>
          <FadeIn delay={0.2}>
            <GoldButton onClick={scrollToForm} large>
              AGENDAR MINHA AVALIAÇÃO
            </GoldButton>
          </FadeIn>
          <FadeIn delay={0.3}>
            <p style={{ marginTop: '24px' }}>
              <a
                href="https://wa.me/5511919148575"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: colors.textMuted,
                  textDecoration: 'none',
                  fontSize: '14px',
                  transition,
                }}
                onMouseEnter={(e) => (e.target.style.color = colors.goldPrimary)}
                onMouseLeave={(e) => (e.target.style.color = colors.textMuted)}
              >
                Ou fale diretamente pelo WhatsApp →
              </a>
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer style={{ background: colors.bgPrimary, borderTop: `1px solid ${colors.borderSubtle}`, padding: '64px 24px 32px' }}>
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
            gap: '48px',
            marginBottom: '48px',
          }}
        >
          {/* Col 1 */}
          <div>
            <div style={{ marginBottom: '16px' }}>
              <span
                style={{
                  fontFamily: fonts.heading,
                  fontSize: '18px',
                  fontWeight: 400,
                  color: colors.textPrimary,
                  letterSpacing: '0.5px',
                }}
              >
                Dr. Luiz Gatti
              </span>
            </div>
            <p style={{ fontSize: '14px', color: colors.textSecondary, lineHeight: 1.6, marginBottom: '8px' }}>
              Excelência em estética corporal e facial
            </p>
            <p style={{ fontSize: '12px', color: colors.textDim }}>
              CRM ativo • Médico Especialista
            </p>
          </div>

          {/* Col 2 */}
          <div>
            <h4
              style={{
                fontSize: '12px',
                fontWeight: 600,
                letterSpacing: '2px',
                textTransform: 'uppercase',
                color: colors.goldPrimary,
                marginBottom: '20px',
              }}
            >
              Unidades
            </h4>
            {['São Paulo - SP', 'Alphaville - SP', 'Campinas - SP'].map((loc) => (
              <p key={loc} style={{ fontSize: '14px', color: colors.textSecondary, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MapPin size={14} color={colors.textDim} /> {loc}
              </p>
            ))}
          </div>

          {/* Col 3 */}
          <div>
            <h4
              style={{
                fontSize: '12px',
                fontWeight: 600,
                letterSpacing: '2px',
                textTransform: 'uppercase',
                color: colors.goldPrimary,
                marginBottom: '20px',
              }}
            >
              Contato
            </h4>
            <a
              href="https://wa.me/5511919148575"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: '14px',
                color: colors.textSecondary,
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '12px',
              }}
            >
              <Phone size={14} color={colors.textDim} /> (11) 91914-8575
            </a>
            <a
              href="https://instagram.com/dr.luizgatti"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: '14px',
                color: colors.textSecondary,
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <Instagram size={14} color={colors.textDim} /> @dr.luizgatti
            </a>
          </div>
        </div>

        {/* Divider */}
        <div
          style={{
            width: '100%',
            height: '1px',
            background: `linear-gradient(90deg, transparent, rgba(201,168,76,0.12), transparent)`,
            marginBottom: '24px',
          }}
        />

        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '13px', color: colors.textDim, marginBottom: '4px' }}>
            © 2025 Dr. Luiz Gatti. Todos os direitos reservados.
          </p>
          <p style={{ fontSize: '11px', color: colors.textDim }}>
            Responsável Técnico: Dr. Luiz Gatti
          </p>
        </div>
      </footer>

      {/* ─── WHATSAPP FLOATING BUTTON ─── */}
      <a
        href="https://wa.me/5511919148575?text=Ol%C3%A1%2C%20gostaria%20de%20agendar%20uma%20avalia%C3%A7%C3%A3o!"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: '#25D366',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(37,211,102,0.4)',
          zIndex: 999,
          transition,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)'
          e.currentTarget.style.boxShadow = '0 8px 32px rgba(37,211,102,0.5)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)'
          e.currentTarget.style.boxShadow = '0 4px 20px rgba(37,211,102,0.4)'
        }}
      >
        <svg viewBox="0 0 24 24" width="28" height="28" fill="white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>
    </div>
  )
}

// ─── Sub-components ───

function ProcedureCard({ card, delay }) {
  const [hovered, setHovered] = useState(false)
  return (
    <FadeIn delay={delay}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: hovered
            ? `linear-gradient(135deg, ${colors.bgCard}, rgba(201,168,76,0.04))`
            : colors.bgCard,
          border: `1px solid ${hovered ? colors.borderHover : colors.borderSubtle}`,
          borderRadius: '8px',
          padding: '40px',
          transform: hovered ? 'translateY(-4px)' : 'none',
          boxShadow: hovered ? '0 16px 48px rgba(201,168,76,0.06)' : 'none',
          transition,
          height: '100%',
        }}
      >
        <span style={{ fontSize: '28px', display: 'block', marginBottom: '20px', color: colors.goldPrimary }}>
          {card.icon}
        </span>
        <h3
          style={{
            fontFamily: fonts.heading,
            fontWeight: 400,
            fontSize: '21px',
            color: colors.textPrimary,
            marginBottom: '16px',
          }}
        >
          {card.title}
        </h3>
        <p
          style={{
            fontSize: '14px',
            lineHeight: 1.7,
            color: colors.textSecondary,
            marginBottom: '24px',
          }}
        >
          {card.desc}
        </p>
        <GoldDivider />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
          {card.highlights.map((h) => (
            <div key={h} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Check size={14} color={colors.goldPrimary} />
              <span style={{ fontSize: '13px', color: colors.textMuted }}>{h}</span>
            </div>
          ))}
        </div>
      </div>
    </FadeIn>
  )
}

function BenefitCard({ item }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? `rgba(201,168,76,0.03)` : 'transparent',
        border: `1px solid ${hovered ? colors.borderHover : colors.borderSubtle}`,
        borderRadius: '8px',
        padding: '32px',
        transform: hovered ? 'translateY(-4px)' : 'none',
        transition,
      }}
    >
      <span style={{ fontSize: '28px', display: 'block', marginBottom: '16px' }}>{item.emoji}</span>
      <h3
        style={{
          fontFamily: fonts.heading,
          fontWeight: 400,
          fontSize: '20px',
          color: colors.textPrimary,
          marginBottom: '10px',
        }}
      >
        {item.title}
      </h3>
      <p style={{ fontSize: '14px', lineHeight: 1.6, color: colors.textSecondary }}>
        {item.desc}
      </p>
    </div>
  )
}

function FormInput({ placeholder, type = 'text', value, onChange }) {
  const [focused, setFocused] = useState(false)
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        width: '100%',
        padding: '16px 20px',
        fontSize: '15px',
        color: colors.textPrimary,
        background: focused ? 'rgba(201,168,76,0.04)' : colors.bgInput,
        border: `1px solid ${focused ? 'rgba(201,168,76,0.4)' : 'rgba(201,168,76,0.08)'}`,
        borderRadius: '6px',
        outline: 'none',
        fontFamily: fonts.body,
        transition,
      }}
    />
  )
}

function TestimonialCard({ dep }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: colors.bgCard,
        border: `1px solid ${hovered ? colors.borderHover : colors.borderSubtle}`,
        borderRadius: '8px',
        padding: '32px',
        position: 'relative',
        transform: hovered ? 'translateY(-4px)' : 'none',
        transition,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Decorative quote */}
      <span
        style={{
          position: 'absolute',
          top: '16px',
          left: '24px',
          fontFamily: fonts.heading,
          fontSize: '60px',
          lineHeight: 1,
          color: 'rgba(201,168,76,0.12)',
          pointerEvents: 'none',
        }}
      >
        "
      </span>

      {/* Stars */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '16px', position: 'relative', zIndex: 1 }}>
        {[...Array(5)].map((_, i) => (
          <Star key={i} size={14} fill={colors.goldPrimary} color={colors.goldPrimary} />
        ))}
      </div>

      {/* Text */}
      <p
        style={{
          fontSize: '14px',
          lineHeight: 1.7,
          color: colors.textSecondary,
          flex: 1,
          marginBottom: '20px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {dep.text}
      </p>

      {/* Divider */}
      <div
        style={{
          width: '100%',
          height: '1px',
          background: `linear-gradient(90deg, transparent, rgba(201,168,76,0.1), transparent)`,
          marginBottom: '16px',
        }}
      />

      {/* Author */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${colors.bgPrimary}, rgba(201,168,76,0.1))`,
            border: `1px solid rgba(201,168,76,0.15)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px',
            overflow: 'hidden',
            flexShrink: 0,
          }}
        >
          {dep.name.charAt(0)}
        </div>
        <div>
          <p style={{ fontSize: '14px', fontWeight: 600, color: colors.textPrimary, marginBottom: '2px' }}>
            {dep.name}
          </p>
          <p style={{ fontSize: '11px', color: colors.textDim }}>Paciente verificada</p>
        </div>
      </div>
    </div>
  )
}

function FaqItem({ question, answer, isOpen, onClick }) {
  return (
    <div style={{ borderBottom: `1px solid rgba(201,168,76,0.06)` }}>
      <button
        onClick={onClick}
        style={{
          width: '100%',
          padding: '24px 0',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '16px',
        }}
      >
        <span
          style={{
            fontFamily: fonts.heading,
            fontSize: '17px',
            fontWeight: 400,
            color: isOpen ? colors.goldPrimary : colors.textPrimary,
            textAlign: 'left',
            transition,
          }}
        >
          {question}
        </span>
        <span
          style={{
            color: colors.goldPrimary,
            fontSize: '22px',
            fontWeight: 300,
            lineHeight: 1,
            transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s ease',
            flexShrink: 0,
          }}
        >
          +
        </span>
      </button>
      <div
        style={{
          maxHeight: isOpen ? '300px' : '0',
          overflow: 'hidden',
          transition: 'max-height 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <p
          style={{
            fontSize: '14px',
            lineHeight: 1.7,
            color: colors.textSecondary,
            paddingBottom: '24px',
          }}
        >
          {answer}
        </p>
      </div>
    </div>
  )
}
