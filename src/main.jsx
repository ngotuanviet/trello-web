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
import { PersistGate } from 'redux-persist/integration/react'
import { persistStore } from 'redux-persist'
import { injectStore } from '~/apis/config';
const persister = persistStore(store)
// Kỹ thuật inject Store là kỹ thuật khi cần sử dụng biền redux store o các file ngoài phạm vi component nhu file config hiện tại
injectStore(store)
// Cấu hình react-router-dom với browserRouter
ReactDOM.createRoot(document.getElementById('root')).render(
  <>
    <BrowserRouter basename='/'>
      <Provider store={store}>
        <PersistGate persistor={persister}>
          <CssVarsProvider theme={theme}>
            <ConfirmProvider defaultOptions={{
              dialogProps: { maxWidth: 'xs' },
              allowClose: false,
              confirmationButtonProps: { color: 'secondary', variant: 'outlined' },
              cancellationButtonProps: { color: 'inherit' },
            }}>

              <CssBaseline />

              <App />
              <ToastContainer />



            </ConfirmProvider>

          </CssVarsProvider>
        </PersistGate>

      </Provider >
    </BrowserRouter>
  </>
)
