import HealthCardList from "~/components/HealthCardList";
import HealthStatusForm from "~/components/HealthStatusForm";

const HealthRecord = () => (
  <div className="content-wrapper">
    <h2>Add a Health Record</h2>

    <section>
      <p>
        Use this section to <strong>log, manage, and update your health records</strong>. Keeping an accurate record of
        your symptoms, treatments, and medical history helps you stay informed and improves communication with your
        healthcare providers.
      </p>
    </section>

    <section>
      <article>
        <h3>What You’ll Be Able to Do</h3>
        <ul>
          <li>📝 Add new health records including symptoms, notes, and vital signs</li>
          <li>✏️ Edit existing entries to keep your information up to date</li>
          <li>🗑️ Delete records that are no longer needed</li>
          <li>📅 Track changes over time to spot trends or improvements</li>
        </ul>
      </article>
    </section>

    <section>
      <p>
        This feature empowers you to take control of your health by making it easy to document and reflect on your
        journey. Your entries here will also fuel data visualizations in the reporting section.
      </p>
    </section>

    <section>
      <p>
        <em>A healthier future starts with clear records. Start logging today!</em>
      </p>
    </section>

    <HealthCardList />
    <HealthStatusForm/>
  </div>
);

export default HealthRecord;
