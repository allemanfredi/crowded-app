import i18n from 'i18next'
import { reactI18nextModule } from 'react-i18next'
import * as Localization from 'expo-localization'

const languageDetector = {
  type: 'languageDetector',
  async: true,
  detect: (callback) => {
    return Localization.getLocalizationAsync().then(({ locale }) => {
      callback(locale)
    })
  },
  init: () => {},
  cacheUserLanguage: () => {},
}

i18n
  .use(languageDetector)
  .use(reactI18nextModule)
  .init({
    fallbackLng: 'en',

    resources: {
      en: {
        global: {
          deniedLocation: "It looks like you haven't enabled geolocation!",
          deniedLocationDesc:
            'Error retrieving your position. If you want to vote you need to enable geolocation',
          locationNotEnabled:
            'Impossible to vote without first enabling geolocation',
          locationNotEnabledDesc:
            "If you don't authorize the geolocalization it will be not possible to vote!",
        },
        tab: {
          search: 'Search',
          contribute: 'Contribute',
        },
        search: {
          title: 'Is it ',
          crowded: 'Crowded',
          searchPlaceholder: 'Where do you want to go?',
          error:
            'There was a problem with contacting the server. Try again later!',
        },
        result: {
          noData:
            "I'm sorry, at the moment here is no data for the selected place.",
          newSearch: 'New Search',
          high: 'Very Crowded!',
          medium: 'Crowded!',
          low: 'Not Crowded!',
        },
        report: {
          title: 'Is it crowded in the place where you are?',
          description:
            'Let us know if the place where you are is very, crowded, your opinion matters!',
          succed: 'Thanks! Your contribute is important.',
          descSucced: 'Your vote has been succesfully submitted.',
          failed: 'I know you want to help the society, but you have to wait!',
          networkError:
            'There was a problem with contacting the server. Try again later!',
          descFailed:
            'Your vote has not been submitted, You can submit it in at least 5 minutes from the last contribute.',
          yes: '(yes)',
          no: '(no)',
        },
      },
      'it-IT': {
        global: {
          deniedLocation:
            'Sembra che tu non abbia abilitato la geolocalizzazione!',
          deniedLocationDesc:
            'Errore nel recuperare la tua posizione. Se vuoi votare è necessario abilitare la geolocalizzazione',
          locationNotEnabled:
            'Impossibile votare senza aver prima abilitato la geolocalizzazione!',
          locationNotEnabledDesc:
            'Se non autorizzi la geolocalizzazione non sarà possibile votare.',
        },
        tab: {
          search: 'Cerca',
          contribute: 'Contribuisci',
        },
        search: {
          title: "C'è ",
          crowded: 'Affollato',
          searchPlaceholder: 'Dove vuoi andare?',
          error:
            "C'è stato un problema nel contattare il server. Riprova più tardi!",
        },
        result: {
          noData:
            'Mi dispiace, al momento non ci sono dati per il posto selezionato.',
          newSearch: 'Nuova Ricerca',
          high: 'Molto Affollato!',
          medium: 'Affollato!',
          low: 'Non Affollato!',
        },
        report: {
          title: "E' affollato il posto in cui ti trovi?",
          description:
            'Facci sapere se il posto in cui ti trovi è molto affollato, la tua opinione conta!',
          succed: 'Grazie! Il tuo contributo è importante.',
          descSucced: 'Il tuo voto è stato inviato con successo.',
          failed:
            'Lo so che vuoi aiutare la società, ma purtroppo devi aspettare!',
          networkError:
            "C'è stato un problema nel contattare il server. Riprova più tardi!",
          descFailed:
            'Il tuo voto non è stato salvato, devi aspettare che passino almeno 5 minuti.',
          yes: '(si)',
          no: '(no)',
        },
      },
    },
    defaultLanguage: 'en',
    debug: true,
  })

export default i18n
