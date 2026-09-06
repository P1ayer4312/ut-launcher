import "./GuideModal.scss";
import { useGlobalState } from "@src/frontend/state/useGlobalState";
import { FaKiwiBird } from "react-icons/fa";
import ExternalLink from "@src/frontend/components/external-link/ExternalLink";

export default function GuideModal() {
  const setModalData = useGlobalState((e) => e.setModalData);

  return (
    <div>
      <div className="guide-modal_wrapper">
        <CustomGuides />
      </div>
      <div className="guide-modal_footer">
        <div
          className="guide-modal_close-btn"
          onClick={() => setModalData({ modalType: "blank", isOpened: false })}
        >
          <FaKiwiBird />
          <span>Close</span>
        </div>
      </div>
    </div>
  );
}

function CustomGuides() {
  const selectedGame = useGlobalState((e) => e.selectedGame);

  switch (selectedGame) {
    case "ut-alpha": {
      return (
        <div>
          <p>
            {`In this guide we'll show how to create an account, how to login to your account inside Unreal
            Tournament 4 and how to customize your profile appearance.`}
          </p>
          <h3>1. Creating an account</h3>
          <hr />
          <p className="guide-modal_row-text-img">
            <div>
              <div>
                To create an account you need to register to the community UT4 Master Server:{" "}
                <ExternalLink link="https://ut4.timiimit.com/Register" />
              </div>
              <br />
              <div>
                Once you created the account you can login with your credentials and view your profile
                information: <ExternalLink link="https://ut4.timiimit.com/Login" />
              </div>
            </div>
          </p>
          <p className="guide-modal_row-text-img">
            <img src="./imgs/guides/ut-alpha/register.jpg" alt="" style={{ width: "45%" }} />
            <img src="./imgs/guides/ut-alpha/player-profile.jpg" alt="" />
          </p>
          <p className="guide-modal_center-img">
            <span>
              {`Inside the profile page there's a button in the top right corner called "GET CODE". Click on
              that button to generate an authentication code which will be entered inside the game. Copy the
              code and launch Unreal Tournament 4.`}
            </span>
            <img src="./imgs/guides/ut-alpha/copy-auth-code.jpg" style={{ maxWidth: "100%" }} alt="" />
          </p>
          <h3>2. Login inside Unreal Tournament 4</h3>
          <hr />
          <p className="guide-modal_row-text-img">
            <span>
              {`Once you've launched the game you'll be greeted with this screen. Inside the red box copy the
              auth code that you generated earlier from your account profile page. After that click on "Add
              Account". If everything went well you'll be redirected to the account management screen.`}
            </span>
            <img src="./imgs/guides/ut-alpha/first-launch.jpg" style={{ width: "300px" }} alt="" />
          </p>
          <p className="guide-modal_row-text-img">
            <div>
              <p>
                {`Inside this screen you can see and manage all your saved accounts, select your account and
                click "Use". After that you should be redirected to the game's home page.`}
              </p>
              <p>
                <b style={{ color: "red", fontSize: "20px" }}>Note: </b>
                {`Account auth codes expired after a certain period, you can renew your code by clicking on the
                "Renew" button, or generating a new code from the account profile page and copying it again,
                same steps as before.`}
              </p>
            </div>
            <img src="./imgs/guides/ut-alpha/accounts-screen.jpg" style={{ width: "300px" }} alt="" />
          </p>
          <h3>3. Customizing your profile and character</h3>
          <hr />
          <p className="guide-modal_row-text-img">
            <span>
              {`Inside the game's home page click on the top right gear and then click on "Player Settings".
              There you can set your country flag, clan name, customize your character and set your avatar.`}
            </span>
            <img src="./imgs/guides/ut-alpha/player-settings.jpg" style={{ width: "300px" }} alt="" />
          </p>
        </div>
      );
    }

    case "ut-3": {
      return (
        <div>
          <p>
            {`In this guide we'll show how to register an account to OpenSpy and how to login inside Unreal
            Tournament 3. The product key should be automatically set upon install, but if it requires one
            again you can register it from the "Settings" tab.`}
          </p>
          <p className="guide-modal_row-text-img">
            <span>
              {`On your first launch of the game you'll be greeted with the login screen. Click on the "CREATE
              PROFILE" button in the bottom to create a new account.`}
            </span>
            <img src="./imgs/guides/ut-3/login-screen.jpg" style={{ width: "500px" }} alt="" />
          </p>
          <p className="guide-modal_row-text-img">
            <span>
              {`Then you'll be presented with a registration form where you can set your username, password and
              email. After filling the fields click on "CREATE PROFILE". If everything went well you should
              see the game's main menu.`}
            </span>
            <img src="./imgs/guides/ut-3/create-profile.jpg" style={{ width: "500px" }} alt="" />
          </p>
          <p>
            {`On your next game launch you'll need to fill in your username and password which you created
            earlier. You can click on "Save Password" and "Automatically Login" to avoid filling in your
            credentials on each launch.`}
          </p>
        </div>
      );
    }

    default: {
      return <div>UNDEFINED_GUIDE_MODAL {selectedGame}</div>;
    }
  }
}
