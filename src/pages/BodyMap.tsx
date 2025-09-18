import BodyMapViewer from "~/components/BodyMapViewer";

const BodyMap = () => (
  <div className="content-wrapper">
    <h2>Interactive Body Map</h2>

    <section>
      <p>
        The <strong>Body Map</strong> provides a visual way to log and review your health symptoms and conditions,
        directly on a representation of the human body.
      </p>
    </section>

    <div style={{ display: "flex", justifyContent: "center", margin: "2rem 0" }}>
      <BodyMapViewer />
    </div>

    <section>
      <article>
        <h3>Features</h3>
        <ul>
          <li>🧍 Clickable body parts for localized symptom tracking</li>
          <li>🧠 Visual highlights of pain points, injuries, or affected areas</li>
          <li>📝 Input notes or observations for specific regions</li>
          <li>📅 Time-based views to compare past and present data</li>
        </ul>
      </article>
    </section>

    <section>
      <p>
        This feature makes health tracking more intuitive and visual, helping users and clinicians understand where
        symptoms are occurring and how they evolve over time.
      </p>
    </section>
  </div>
);

export default BodyMap;
