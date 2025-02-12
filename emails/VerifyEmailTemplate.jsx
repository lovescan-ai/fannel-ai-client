import {Html, Text, Section, Container, Link, Img} from "@react-email/components"
// import logo from '../public/lime.jpg'



const VerifyEmailTemplate = ({name, emailVerificationToken, emailAddress}) => {
    const home = process.env.NODE_ENV == "production" ? "https://flannel-ai-7coi.onrender.com/" : "http://localhost:3000";
    const baseUrl = process.env.NODE_ENV == "production" ? "https://flannel-ai-7coi.onrender.com/" : "";

  return (
    <Html>
      <Section style={main}>
        <Container style={container}>
          <Container style={container}>
            <Img src={`https://res.cloudinary.com/issie/image/upload/v1713544661/Work/Fannel/fannel-logo_p6fs5j.png`} alt={"Flannel AI"} width="" height="42" />
            {/* <Img src={`${baseUrl}/static/logo.png`} alt={"Flannel AI"} width="" height="42" /> */}
          </Container>
          <Text style={heading}>Hi there, {name || "Username"}!</Text>
          <Text style={paragraph}>Thank you for choosing Fannel AI. Please use this link to verify your email address and start exploring our services!</Text>
          <Link style={link} href={`${home}auth/verify-email?token=${emailVerificationToken}&email=${emailAddress}`}>Click to verify</Link>
        </Container>
      </Section>
    </Html>
  )
}

export default VerifyEmailTemplate

// Styles for the email template
const main = {
  backgroundColor: "#ffffff",
}

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
  width: "580px",
}

const heading = {
  fontSize: "32px",
  lineHeight: "1.3",
  fontWeight: "700",
  color: "#484848",
}

const paragraph = {
  fontSize: "18px",
  lineHeight: "1.4",
  color: "#484848",
}

const link = {
  backgroundColor:"#496AEB",
  borderRadius:"10px",
  color:"#484848",
  padding:"8px 16px"

}

