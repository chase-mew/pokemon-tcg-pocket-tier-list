import LegalPage from "./LegalPage";
import { GITHUB_URL } from "../../app/constants";

// About page. Describes the site, its data sources, and how it works — both
// useful for visitors and a positive trust signal for AdSense review.
const AboutPage = () => {
  return (
    <LegalPage>
      <h1>About Top Pocket Decks</h1>

      <p>
        Top Pocket Decks is a free, data-driven tier list and deck-building
        companion for the mobile game Pokémon Trading Card Game Pocket. Our goal
        is to help players stay ahead of the competitive meta with rankings built
        from real tournament results rather than opinion.
      </p>

      <h2>What you can do here</h2>
      <ul>
        <li>
          <strong>Tier list.</strong> Browse the strongest current decks, ranked
          from S to E tier and updated regularly.
        </li>
        <li>
          <strong>Best Deck Finder.</strong> Mark the cards you are missing and
          instantly see the strongest deck you can build with your collection.
        </li>
        <li>
          <strong>Matchups.</strong> See which decks each deck is strong and weak
          against, with win-rate percentages.
        </li>
        <li>
          <strong>Best cards.</strong> Explore a card-level tier list across
          expansions.
        </li>
      </ul>

      <h2>How the rankings work</h2>
      <p>
        Deck rankings and statistics are derived from tournament data sourced
        from{" "}
        <a
          href="https://limitlesstcg.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Limitless
        </a>
        , using an algorithm that weighs tournament participation, win rates, and
        top-cut performance. Card information is provided by the open-source{" "}
        <a
          href="https://github.com/chase-manning/pokemon-tcg-pocket-cards"
          target="_blank"
          rel="noopener noreferrer"
        >
          pokemon-tcg-pocket-cards
        </a>{" "}
        project.
      </p>

      <h2>Premium</h2>
      <p>
        The site is free to use. An optional Premium subscription removes ads and
        unlocks additional features such as detailed matchups, advanced filters,
        alternative rankings, more decks, and faster updates.
      </p>

      <h2>Open source</h2>
      <p>
        Top Pocket Decks is open source. You can view the source code on{" "}
        <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
        .
      </p>

      <h2>Contact</h2>
      <p>
        Questions, feedback, or feature requests are welcome at{" "}
        <a href="mailto:chase@manning.dev">chase@manning.dev</a>.
      </p>

      <p>
        Top Pocket Decks is a fan-made project and is not affiliated with,
        endorsed by, or sponsored by Nintendo, The Pokémon Company, Creatures
        Inc., GAME FREAK Inc., or DeNA. All trademarks are the property of their
        respective owners.
      </p>
    </LegalPage>
  );
};

export default AboutPage;
