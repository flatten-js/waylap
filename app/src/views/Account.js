import { useState, useEffect } from 'react'

import { useForm } from 'react-hook-form'

import { 
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Stack 
} from '@mui/material'
import { ScienceSharp } from '@mui/icons-material'

import UserTemplate from "@@/templates/UserTemplate"
import { Pop, FormItem } from '@@/components'
import { getProjectUserId, generateProject } from '@@/store'
import useAlerts from '@@/hooks/useAlerts'

let mounted = false
function Account() {
  const [projects, setProjects] = useState([])
  const [isGenerate, setIsGenerate] = useState(false)
  const [generating, setGenerating] = useState(false)

  const { control, handleSubmit, reset } = useForm({})

  const [alerts, { setCreateAlert, setCreateErrorAlert }] = useAlerts()

  async function fetch() {
    try {
      const projects = await getProjectUserId()
      setProjects(projects)
    } catch (e) {
      setCreateAlert('Failed to load data.')
    }
  }

  async function onMounted() {
    mounted = true
    await fetch()
  }

  useEffect(() => {
    if (!mounted) onMounted()
  }, [])

  async function getCurrentPosition() {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords
        return resolve([latitude, longitude])
      }, reject)
    })
  }

  async function generate(data) {
    if (generating) return
    
    try {
      setGenerating(true)

      const location = await getCurrentPosition()
      await generateProject({ ...data, location: location.join(',') })
      await fetch()

      setIsGenerate(false)
      setCreateAlert('Generating has been completed.', 'success')
      reset()
    } catch (e) {
      setCreateErrorAlert(e)
    } finally {
      setGenerating(false)
    }
  }

  return (
    <>
      <UserTemplate alerts={ alerts }>
        <Grid container spacing={2}>
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'right' }}>
            <Button variant="outlined" onClick={ () => setIsGenerate(true) }>Generate</Button>
          </Grid>
          
          {
            projects.length
            ? (
              projects.map(project => {
                return (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={ project.id }>
                    <Pop 
                      id={ project.id } 
                      title={ project.title } 
                      description={ project.description }
                      image={ project.image }
                      loaded
                    />
                  </Grid>
                )
              })
            )
            : (
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <Pop />
              </Grid>
            )
          }
        </Grid>
      </UserTemplate> 

      <Dialog open={ isGenerate } maxWidth="sm">
        <DialogTitle>
          <Stack direction="row" alignItems="center">
            Generate 
            <ScienceSharp />
          </Stack>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>Automatically assigns spots around the specified location and creates a new project.</DialogContentText>
          <Grid container sx={{ p: 2 }}>
            <Grid item xs={12} sx={{ mb: 2 }}>
              <FormItem
                name="title" 
                control={ control } 
                rules={{
                  'required': 'Please enter a title for your project'
                }}
              >
                <TextField
                  variant="standard" 
                  label="Title"
                  defaultValue=""
                  fullWidth
                  required
                />
              </FormItem>
            </Grid>
            <Grid item xs={12}>
              <FormItem
                name="description" 
                control={ control }
              >
                <TextField 
                  variant="standard" 
                  label="Description"
                  defaultValue=""
                  multiline
                  rows={4}
                  fullWidth
                />
              </FormItem>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button disabled={ generating } onClick={ () => setIsGenerate(false) }>Cancel</Button>
          <Button disabled={ generating } onClick={ handleSubmit(generate) }>Generate</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default Account