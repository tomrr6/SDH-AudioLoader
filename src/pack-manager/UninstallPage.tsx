import { PanelSectionRow, ButtonItem } from "decky-frontend-lib";
import { useState, VFC } from "react";
import { FaTrash } from "react-icons/fa";
import * as python from "../python";

import { useGlobalState } from "../state/GlobalState";
import { Pack } from "../classes";

export const UninstallPage: VFC = () => {
  const {
    soundPacks,
    setSoundPacks,
    activeSound,
    setActiveSound,
    selectedMusic,
    setSelectedMusic,
    menuMusic,
    setMenuMusic,
  } = useGlobalState();

  const [isUninstalling, setUninstalling] = useState(false);

  function fetchLocalPacks() {
    python.resolve(python.reloadPacksDir(), () => {
      python.resolve(python.getSoundPacks(), (data: any) => {
        setSoundPacks(data);
      });
    });
  }

  function handleUninstall(listEntry: Pack) {
    setUninstalling(true);
    python.resolve(python.deletePack(listEntry.data.name), () => {
      fetchLocalPacks();
      if (
        activeSound === listEntry.data.name ||
        selectedMusic === listEntry.data.name
      ) {
        console.log(
          "Audio Loader - Attempted to uninstall applied sound/music, changing applied packs to Default"
        );
        if (activeSound === listEntry.data.name) setActiveSound("Default");
        if (selectedMusic === listEntry.data.name) {
          setSelectedMusic("None");
          if (menuMusic !== null) {
            menuMusic.StopPlayback();
            setMenuMusic(null);
          }
        }
        const configObj = {
          selected_pack:
            activeSound === listEntry.data.name ? "Default" : activeSound,
          selected_music:
            selectedMusic === listEntry.data.name ? "None" : activeSound,
        };
        python.setConfig(configObj);
      }
      setUninstalling(false);
    });
  }

  if (soundPacks.length === 0) {
    return (
      <PanelSectionRow>
        <span>No packs installed, find some in the 'Browse Packs' tab.</span>
      </PanelSectionRow>
    );
  }

  return (
    <>
      {soundPacks
        .sort((a, b) => a.data.name.localeCompare(b.data.name))
        .map((e: Pack) => (
          <PanelSectionRow>
            <ButtonItem
              label={e.data.name}
              onClick={() => handleUninstall(e)}
              disabled={isUninstalling}
            >
              <FaTrash />
            </ButtonItem>
          </PanelSectionRow>
        ))}
    </>
  );
};
