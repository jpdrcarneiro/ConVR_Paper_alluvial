
# load packages and prepare data
library(alluvial)

#readFile
df <- read.csv(file="Group1-AlluvialData.csv", header=TRUE, sep=",")

tit <- as.data.frame(Titanic)

# only two variables: class and survival status
tit2d <- aggregate( Freq ~ Class + Survived, data=tit, sum)

alluvial( tit2d[,1:2], freq=tit2d$Freq, xw=0.0, alpha=0.8,
          gap.width=0.1, col= "steelblue", border="white",
          layer = tit2d$Survived != "Yes" )

alluvial( df[,2:6], freq=df$Freq,
          border=NA,
          hide = df$Freq < quantile(df$Freq, .50),
          col=ifelse( df$Energy.Consumption.Reduction. == "Decrease", "green", "gray") )
library("plotly")

#png(height = 360, width = 600, file = "inst/fig/example-facet.png")
ggplot(as.data.frame(df),
       aes(weight = Freq, axis1 = ENV0, axis2 = ENV1, axis3 = Change., axis4 = Energy.Consumption.Reduction.)) +
  geom_alluvium(aes(fill = Energy.Consumption.Reduction.)) +
  geom_stratum() +
  geom_text(stat = "stratum") +
  facet_wrap(~ Time, scales = "free_y") +
  scale_x_continuous(breaks = 1:4, labels = c("Env 0", "Env 1", "Change?", "Consumption")) +
  ggtitle("Group 1 Choices")
dev.off()

ggplotly()

