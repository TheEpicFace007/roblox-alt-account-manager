import * as React from 'react';
import { AltListItem } from '../shared-component/AltListItem';
import { AltAccount } from '../shared/storage';

import './styles.scss';

const Options: React.FC = () => {
  const [alts, setAlts] = React.useState<AltAccount[]>([]);
  React.useEffect(() => {
    load()
    async function load() {
      const alts = await AltAccount.getAll()
      setAlts(alts)
    }
  }, [])

  function removeAlt(username: string) {
    AltAccount.getWithUsername(username).then(altAccount => {
      if (altAccount !== null) {
        AltAccount.remove(altAccount.id)
        window.location.reload()
      } 
    })
  }
  return (
    <div>
      <div className="options">
        {alts.map((alt, i) => (
          <AltListItem key={i} alt={alt.username} onRemoveAlt={removeAlt} onUseAlt={function () {}}/>
        ))}
      </div>
    </div>
  );
};

export default Options;
