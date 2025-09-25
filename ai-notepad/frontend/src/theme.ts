import { extendTheme, type ThemeConfig } from '@chakra-ui/react'

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: true,
}

// 清新渐变色彩方案
const gradients = {
  // 清新蓝绿渐变
  freshBlue: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  oceanBreeze: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
  deepOcean: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  skyBlue: 'linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)',
  
  // 温暖橙粉渐变
  sunsetGlow: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
  peachDream: 'linear-gradient(135deg, #ffeaa7 0%, #fab1a0 100%)',
  warmSunset: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  goldenHour: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  
  // 清新绿色渐变
  mintFresh: 'linear-gradient(135deg, #a8e6cf 0%, #dcedc1 100%)',
  forestMist: 'linear-gradient(135deg, #c3f0ca 0%, #faf0e6 100%)',
  springGreen: 'linear-gradient(135deg, #56ab2f 0%, #a8e6cf 100%)',
  emeraldDream: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
  
  // 紫色梦幻渐变
  purpleDream: 'linear-gradient(135deg, #e0c3fc 0%, #9bb5ff 100%)',
  lavenderMist: 'linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)',
  mysticPurple: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  royalPurple: 'linear-gradient(135deg, #8360c3 0%, #2ebf91 100%)',
  
  // 粉色系渐变
  rosePetal: 'linear-gradient(135deg, #ffeef8 0%, #f8d7da 100%)',
  cherryBlossom: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
  sweetPink: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
  
  // 中性渐变
  cloudyDay: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
  silverLining: 'linear-gradient(135deg, #e8eaf6 0%, #f3e5f5 100%)',
  moonlight: 'linear-gradient(135deg, #e3ffe7 0%, #d9e7ff 100%)',
  softGray: 'linear-gradient(135deg, #f7f8fc 0%, #dde1e7 100%)',
}

const theme = extendTheme({
  config,
  fonts: {
    heading: `'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`,
    body: `'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`,
  },
  colors: {
    // 原有品牌色
    brand: {
      50: '#E3F2F9',
      100: '#C5E4F3',
      200: '#A2D2EC',
      300: '#7CC1E4',
      400: '#47A9DA',
      500: '#0088CC',
      600: '#007AB8',
      700: '#006BA1',
      800: '#005885',
      900: '#003F5E',
    },
    // 清新蓝色主题
    freshBlue: {
      50: '#e6f3ff',
      100: '#b3d9ff',
      200: '#80bfff',
      300: '#4da6ff',
      400: '#1a8cff',
      500: '#0073e6',
      600: '#005bb3',
      700: '#004280',
      800: '#002a4d',
      900: '#00111a',
    },
    // 温暖橙色主题
    warmOrange: {
      50: '#fff5e6',
      100: '#ffe0b3',
      200: '#ffcc80',
      300: '#ffb74d',
      400: '#ffa31a',
      500: '#e68900',
      600: '#b36b00',
      700: '#804d00',
      800: '#4d2e00',
      900: '#1a1000',
    },
    // 清新绿色主题
    mintGreen: {
      50: '#e8f5e8',
      100: '#c8e6c9',
      200: '#a5d6a7',
      300: '#81c784',
      400: '#66bb6a',
      500: '#4caf50',
      600: '#43a047',
      700: '#388e3c',
      800: '#2e7d32',
      900: '#1b5e20',
    },
    // 紫色主题
    lavender: {
      50: '#f3e5f5',
      100: '#e1bee7',
      200: '#ce93d8',
      300: '#ba68c8',
      400: '#ab47bc',
      500: '#9c27b0',
      600: '#8e24aa',
      700: '#7b1fa2',
      800: '#6a1b9a',
      900: '#4a148c',
    },
  },
  styles: {
    global: (props: any) => ({
      body: {
        bg: props.colorMode === 'dark' ? 'gray.900' : 'gray.50',
        color: props.colorMode === 'dark' ? 'white' : 'gray.800',
      },
    }),
  },
  components: {
    Button: {
      defaultProps: {
        colorScheme: 'brand',
      },
      variants: {
        gradient: (props: any) => {
          // 从props中获取colorScheme并使用其值来设置渐变背景
          const { colorScheme = 'brand' } = props
          const gradientKey = `${colorScheme}Gradient` as keyof typeof gradients
          const gradientBg = gradientKey in gradients ? gradients[gradientKey] : gradients.freshBlue
          return {
            background: gradientBg,
            color: 'white',
            _hover: {
              opacity: 0.8,
              transform: 'translateY(-1px)',
              boxShadow: 'lg',
            },
            _active: {
              transform: 'translateY(0)',
            },
            transition: 'all 0.2s',
          }
        },
      },
    },
    Box: {
      variants: {
        gradient: {
          background: gradients.oceanBreeze,
          borderRadius: 'xl',
          p: 6,
          boxShadow: 'xl',
        },
      },
    },
  },
})

// 导出渐变样式供组件使用
export { gradients }

export default theme