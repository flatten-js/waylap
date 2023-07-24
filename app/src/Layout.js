import PropTypes from 'prop-types'

import { createTheme, ThemeProvider } from '@mui/material/styles'
import { CssBaseline, Container, Grid, Alert } from '@mui/material'


const theme = createTheme({
  palette: {
    background: {
      default: '#F3F6F9'
    },
    black: {
      main: '#434D5B'
    }
  }
})


function Layout(props) {
  const { alerts } = props

  return (
    <ThemeProvider theme={ theme }>
      <CssBaseline />
      <Container sx={{ height: '100vh', py: 2 }}>
        { props.children }
      </Container>

      <Grid container>
        <Grid item sm={ 12 } md={ 6 } sx={{ width: '100%', p: 1, position: 'fixed', zIndex: 1600, bottom: 0, right: 0 }}>
          {
            alerts.map(alert => {
              return <Alert key={ alert.id } severity={ alert.severity }>{ alert.message }</Alert>   
            })
          }
        </Grid>
      </Grid>
    </ThemeProvider>
  )
}

Layout.propTypes = {
  alerts: PropTypes.array
}

Layout.defaultProps = {
  alerts: []
}

export default Layout