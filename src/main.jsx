import ReactDOM from 'react-dom/client'
import App from '~/App.jsx'
import CssBaseline from '@mui/material/CssBaseline'
import { BrowserRouter } from "react-router-dom";

import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material'
import theme from '~/theme.js'
import { ToastContainer } from 'react-toastify';
import { ConfirmProvider } from 'material-ui-confirm';
import { Provider } from 'react-redux';
import { store } from '~/redux/store';
ReactDOM.createRoot(document.getElementById('root')).render(
  <>
    <Provider store={store}>
      <CssVarsProvider theme={theme}>
        <ConfirmProvider defaultOptions={{
          dialogProps: { maxWidth: 'xs' },
          allowClose: false,
          confirmationButtonProps: { color: 'secondary', variant: 'outlined' },
          cancellationButtonProps: { color: 'inherit' },
        }}>

          <CssBaseline />
          <BrowserRouter>
            <App />
            <ToastContainer />
          </BrowserRouter>


        </ConfirmProvider>

      </CssVarsProvider>
    </Provider >
  </>
)
