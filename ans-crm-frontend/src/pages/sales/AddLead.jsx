import Layout from "../../components/shared/Layout";
import LeadForm from "../../components/sales/LeadForm";

const AddLead = () => {
  return (
    <Layout>
      <div className="page-header">
        <div>
          <h1 className="page-title">Add New Lead</h1>
          <p className="page-subtitle">Fill in all the details to create a new lead</p>
        </div>
      </div>
      <LeadForm />
    </Layout>
  );
};

export default AddLead;
