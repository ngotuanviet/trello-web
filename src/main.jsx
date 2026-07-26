import ReactDOM from 'react-dom/client'
import App from '~/App.jsx'
import CssBaseline from '@mui/material/CssBaseline'
import GlobalStyles from '@mui/material/GlobalStyles';
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
//  Cầu  hinh  Socket-io phia client tại đay va export ra bien socketIoInstance
//https://socket.io/how-to/use-with-react

const persister = persistStore(store)
// Kỹ thuật inject Store là kỹ thuật khi cần sử dụng biền redux store o các file ngoài phạm vi component nhu file config hiện tại
injectStore(store)
// Cấu hình react-router-dom với browserRouter
ReactDOM.createRoot(document.getElementById('root')).render(
  <>
    <Provider store={store}>
      <PersistGate persistor={persister}>
        <BrowserRouter basename='/'>


          <CssVarsProvider theme={theme}>
            <ConfirmProvider defaultOptions={{
              dialogProps: { maxWidth: 'xs' },
              allowClose: false,
              confirmationButtonProps: { color: 'secondary', variant: 'outlined' },
              cancellationButtonProps: { color: 'inherit' },
            }}>
              <GlobalStyles styles={{
                a: {
                  textDecoration: 'none'
                }
              }} />
              <CssBaseline />

              <App />
              <ToastContainer />



            </ConfirmProvider>

          </CssVarsProvider>

        </BrowserRouter>
      </PersistGate>

    </Provider >
  </>
)
