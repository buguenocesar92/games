
tailwind.config = {
  theme: {
    extend: {
      colors: {
        'memory-purple': '#6B46C1',
        'memory-dark': '#1F2937',
        'memory-accent': '#F59E0B',
        'card-back': '#374151',
      },
      fontFamily: {
        'game': ['Poppins', 'sans-serif'],
      },
      animation: {
        'flip': 'flip 0.6s ease-in-out',
        'match': 'match 0.5s ease-in-out',
        'bounce-in': 'bounceIn 0.5s ease-out',
      }
    }
  }
}
