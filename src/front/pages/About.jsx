
import dylan from "../assets/img/dylan.png";
import alex from "../assets/img/alex.png";
import claudia from "../assets/img/claudia.png";
import { Link } from "../components/Link";


export const About = () => {

  return (

    <div className="container-fluid">
      <h1 className="text-center text-white" style={{ fontSize: "70px", lineHeight: 1.7, fontWeight: "bold" }}>
        OUR TEAM:
      </h1>
      <p className="pb-3 text-center text-white" style={{ lineHeight: 2 }}>
        SONORA wouldn’t exist without the dedication of our collaborators.<br />
        Each team member brings unique strengths — whether in design, development,<br />
        or problem-solving — united by a shared passion for music and innovation.<br />
        Together, we combine creativity and technical expertise to build a platform<br />
        that connects people through sound, discovery, and community.
      </p>
      <div id="cards" className="row mb-4">
        {/* CARTA 1 */}
        <div className="col-md-4">
          <div
            className="card mb-4 shadow-sm h-70 overflow-hidden"
            style={{ border: "none", borderRadius: "0.75rem" }}>
            <div className="row g-0 h-70">
              {/* Left image section */}
              <div className="col-4">
                <img
                  src={claudia}
                  alt="Thumbnail 1"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              {/* Right content section */}
              <div className="col-8">
                <div className="card-body d-flex flex-column h-100">
                  <strong className="d-inline-block mb-2 text-primary-emphasis">
                    API Whisperer
                  </strong>
                  <h5 className="card-title">Claudia</h5>
                  <div className="mb-1 text-body-secondary">
                    <i class="p-1 bi bi-geo-alt-fill"></i>
                    BLV
                  </div>
                  <p className="card-text">
                    Ni una mudanza a Bolivia a podido pararla y ni siquiera los días difíciles, nunca se ha rendido. Le costó al principio con las APIs, pero persistió hasta que lo logró. Su dedicación es admirable.
                  </p>
                  <Link to="https://www.instagram.com/portae_lucis/" className="text-decoration-none fw-bold mt-auto">
                    <i class="px-2 bi bi-instagram"></i>
                    Get to know me!
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* CARTA 2 */}
        <div className="col-md-4">
          <div className="card mb-4 shadow-sm h-70 overflow-hidden" style={{ border: "none", borderRadius: "0.75rem" }}>
            <div className="row g-0 h-100">
              {/* Left image section */}
              <div className="col-4">
                <img src={alex} alt="Thumbnail 1"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              {/* Right content section */}
              <div className="col-8">
                <div className="card-body d-flex flex-column h-100">
                  <strong className="d-inline-block mb-2 text-primary-emphasis">
                    Merge Maestro
                  </strong>
                  <h5 className="card-title">Alejandro</h5>
                  <div className="mb-1 text-body-secondary">
                    <i class="p-1 bi bi-geo-alt-fill"></i>
                    ESP</div>
                  <p className="card-text">
                    Siempre hasta tarde trabajando, con un compromiso increíble. Además de ser un gran programador, tiene un sentido del humor que hace que todo el equipo se sienta más ligero y motivado.
                  </p>
                  <Link to="https://www.instagram.com/_alexarj_/" className="text-decoration-none fw-bold mt-auto">
                    <i class="px-2 bi bi-instagram"></i>
                    Get to know me!
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* CARTA 3 */}
        <div className="col-md-4">
          <div
            className="card mb-4 shadow-sm h-70 overflow-hidden"
            style={{ border: "none", borderRadius: "0.75rem" }}>
            <div className="row g-0 h-100">
              {/* Left image section */}
              <div className="col-4">
                <img
                  src={dylan}
                  alt="Thumbnail 1"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              {/* Right content section */}
              <div className="col-8">
                <div className="card-body d-flex flex-column h-100">
                  <strong className="d-inline-block mb-2 text-primary-emphasis">
                    Syntax Samurai
                  </strong>
                  <h5 className="card-title">Featured post</h5>
                  <div className="mb-1 text-body-secondary">
                    <i class="p-1 bi bi-geo-alt-fill"></i>
                    ESP
                  </div>
                  <p className="card-text">
                    Encargado de coordinar y mantener el proyecto en marcha. Siempre intenta aprender de cada desafío y ayudar al equipo donde puede, aunque a veces las horas largas y los errores le ponen a prueba.
                  </p>
                  <Link to="https://www.instagram.com/mfguerrer0/" className="text-decoration-none fw-bold mt-auto">
                    <i class="px-2 bi bi-instagram"></i>
                    Get to know me!
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <h1 className="text-center text-white" style={{ fontSize: "70px", lineHeight: 1.7, fontWeight: "bold" }}>
          OUR MISSION:
        </h1>
        <p className="pb-3 text-center text-white">
          At SONORA, we believe music is far more than sound; it is culture, politics, and connection.<br />
          From Bad Bunny’s Super Bowl performance, which reminded the world that love is more powerful than hate,<br />
          to the quiet struggles of independent artists underpaid by streaming platforms and overlooked by mainstream audiences,<br />
          music carries meaning that transcends the ordinary.<br />
          Our platform exists to bridge that gap to give artists the visibility, opportunities, and fans they deserve,<br />
          while bringing listeners closer to the emotions and stories behind every note.<br />
          Music is a force that strengthens friendships, bonds people across countries, cultures, and even religion;<br />
          it awakens the human spirit; it is a language that speaks to the soul.<br />
          At SONORA, we’re not just sharing songs; we’re amplifying voices, sparking connection,<br />
          and reminding the world that in a time of division, the only power greater than hate is love,<br />
          felt through every melody, beat, and harmony.
        </p>

      </div>
    </div>
  )
}
